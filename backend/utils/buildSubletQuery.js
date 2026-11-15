import { NEIGHBORHOODS } from "../constants/neighborhoods.js";
import { isValidDateString } from "./dates.js";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;
// Keeps skip() small enough for MongoDB even if someone types a huge page.
const MAX_PAGE = 10000;

// Every sort ends with _id so pages never repeat or skip listings that
// share the same rent or createdAt.
const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  rent_asc: { rent: 1, _id: 1 },
  rent_desc: { rent: -1, _id: -1 },
};

const isBlank = (v) => v === undefined || v === "";

function toPositiveInt(value, fallback) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// Turns the search query string into a MongoDB filter, sort and paging.
// Only known fields are used. Returns { error } or { filter, sort, page, limit }.
export function buildSubletQuery(query) {
  const {
    neighborhood,
    minRent,
    maxRent,
    moveIn,
    moveOut,
    furnished,
    sort = "newest",
    page,
    limit,
  } = query;

  const filter = { status: "available" };

  // Express 5 reads ?neighborhood=A&neighborhood=B as ["A", "B"].
  if (!isBlank(neighborhood)) {
    const list = Array.isArray(neighborhood) ? neighborhood : [neighborhood];
    if (!list.every((n) => NEIGHBORHOODS.includes(n))) {
      return { error: "Unknown neighborhood" };
    }
    filter.neighborhood = { $in: list };
  }

  const rent = {};
  for (const [key, value, op] of [
    ["minRent", minRent, "$gte"],
    ["maxRent", maxRent, "$lte"],
  ]) {
    if (isBlank(value)) continue;
    const n = Number(value);
    if (typeof value !== "string" || !Number.isFinite(n) || n < 0) {
      return { error: `${key} must be a number` };
    }
    rent[op] = n;
  }
  if (rent.$gte !== undefined && rent.$lte !== undefined) {
    if (rent.$gte > rent.$lte) {
      return { error: "Minimum rent cannot be more than maximum rent" };
    }
  }
  if (Object.keys(rent).length) filter.rent = rent;

  for (const [key, value] of [
    ["moveIn", moveIn],
    ["moveOut", moveOut],
  ]) {
    if (!isBlank(value) && !isValidDateString(value)) {
      return { error: `${key} must be a valid date (YYYY-MM-DD)` };
    }
  }
  const inDate = isBlank(moveIn) ? null : new Date(moveIn);
  const outDate = isBlank(moveOut) ? null : new Date(moveOut);
  if (inDate && outDate) {
    if (outDate <= inDate) {
      return { error: "Move-out date must be after the move-in date" };
    }
    // The listing covers the whole stay.
    filter.startDate = { $lte: inDate };
    filter.endDate = { $gte: outDate };
  } else if (inDate) {
    filter.startDate = { $lte: inDate };
    filter.endDate = { $gt: inDate };
  } else if (outDate) {
    filter.startDate = { $lt: outDate };
    filter.endDate = { $gte: outDate };
  }

  if (furnished === "true") filter.furnished = true;

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
