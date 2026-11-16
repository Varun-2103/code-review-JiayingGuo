import { NEIGHBORHOODS } from "../constants/neighborhoods.js";
import { isValidDateString } from "./dates.js";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;
// Keeps skip() small enough for MongoDB even if someone types a huge page.
const MAX_PAGE = 10000;

const SLEEP_SCHEDULES = ["early", "late", "flexible"];
const PETS = ["has", "ok", "no"];

// Every sort ends with _id so pages never repeat or skip profiles that
// share the same budget, move-in date or createdAt.
const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  budget_asc: { budget: 1, _id: 1 },
  budget_desc: { budget: -1, _id: -1 },
  movein_asc: { moveInDate: 1, _id: 1 },
};

const isBlank = (v) => v === undefined || v === "";

function toPositiveInt(value, fallback) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// Turns the search query string into a MongoDB filter, sort and paging.
// Only known fields are used. Returns { error } or { filter, sort, page, limit }.
export function buildRoommateQuery(query) {
  const {
    neighborhood,
    minBudget,
    maxBudget,
    moveInFrom,
    moveInTo,
    sleep,
    pets,
    smoking,
    sort = "newest",
    page,
    limit,
  } = query;

  // Hidden profiles never show up in search.
  const filter = { hidden: false };

  // Express 5 reads ?neighborhood=A&neighborhood=B as ["A", "B"].
  // neighborhoods is an array, so $in matches a profile if any of its
  // preferred neighborhoods is chosen.
  if (!isBlank(neighborhood)) {
    const list = Array.isArray(neighborhood) ? neighborhood : [neighborhood];
    if (!list.every((n) => NEIGHBORHOODS.includes(n))) {
      return { error: "Unknown neighborhood" };
    }
    filter.neighborhoods = { $in: list };
  }

  const budget = {};
  for (const [key, value, op] of [
    ["minBudget", minBudget, "$gte"],
    ["maxBudget", maxBudget, "$lte"],
  ]) {
    if (isBlank(value)) continue;
    const n = Number(value);
    if (typeof value !== "string" || !Number.isFinite(n) || n < 0) {
      return { error: `${key} must be a number` };
    }
    budget[op] = n;
  }
  if (budget.$gte !== undefined && budget.$lte !== undefined) {
    if (budget.$gte > budget.$lte) {
      return { error: "Minimum budget cannot be more than maximum budget" };
    }
  }
  if (Object.keys(budget).length) filter.budget = budget;

  const moveIn = {};
  for (const [key, value, op] of [
    ["moveInFrom", moveInFrom, "$gte"],
    ["moveInTo", moveInTo, "$lte"],
  ]) {
    if (isBlank(value)) continue;
    if (!isValidDateString(value)) {
      return { error: `${key} must be a valid date (YYYY-MM-DD)` };
    }
    moveIn[op] = new Date(value);
  }
  if (moveIn.$gte && moveIn.$lte && moveIn.$gte > moveIn.$lte) {
    return { error: "The first move-in date must be before the last one" };
  }
  if (Object.keys(moveIn).length) filter.moveInDate = moveIn;

  if (!isBlank(sleep)) {
    if (!SLEEP_SCHEDULES.includes(sleep)) {
      return { error: "Unknown sleep schedule" };
    }
    filter.sleepSchedule = sleep;
  }

  if (!isBlank(pets)) {
    if (!PETS.includes(pets)) return { error: "Unknown pets option" };
    filter.pets = pets;
  }

  // smoking=no: non-smokers only. smoking=yes: smokers only.
  if (!isBlank(smoking)) {
    if (smoking !== "yes" && smoking !== "no") {
      return { error: "smoking must be yes or no" };
    }
    filter.smoking = smoking === "yes";
  }

  if (typeof sort !== "string" || !SORTS[sort]) {
    return { error: "Unknown sort option" };
  }

  return {
    filter,
    sort: SORTS[sort],
    page: Math.min(toPositiveInt(page, 1), MAX_PAGE),
    limit: Math.min(toPositiveInt(limit, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE),
  };
}
