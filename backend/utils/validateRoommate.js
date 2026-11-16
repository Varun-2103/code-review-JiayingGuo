import { NEIGHBORHOODS } from "../constants/neighborhoods.js";
import { isValidDateString } from "./dates.js";

const SLEEP_SCHEDULES = ["early", "late", "flexible"];
// has: I have a pet. ok: fine with pets. no: no pets please.
const PETS = ["has", "ok", "no"];

const isWholeNumber = (n) => typeof n === "number" && Number.isInteger(n);
const isText = (s, min, max) =>
  typeof s === "string" && s.trim().length >= min && s.trim().length <= max;

// Checks a create or edit request. Only the fields below are read, so a
// request cannot set hidden, author fields or seeded.
// Returns { error } or { value } with clean values ready to save.
export function validateRoommate(body) {
  if (!body || typeof body !== "object") {
    return { error: "Request body is required" };
  }
  const {
    budget,
    neighborhoods,
    moveInDate,
    sleepSchedule,
    pets,
    smoking,
    bio,
  } = body;

  if (!isWholeNumber(budget) || budget <= 0 || budget > 10000) {
    return { error: "Budget must be a whole number from 1 to 10000" };
  }
  if (
    !Array.isArray(neighborhoods) ||
    neighborhoods.length < 1 ||
    neighborhoods.length > 3
  ) {
    return { error: "Please choose 1 to 3 neighborhoods" };
  }
  if (!neighborhoods.every((n) => NEIGHBORHOODS.includes(n))) {
    return { error: "Please choose neighborhoods from the list" };
  }
  if (new Set(neighborhoods).size !== neighborhoods.length) {
    return { error: "Each neighborhood can only be chosen once" };
  }
  if (!isValidDateString(moveInDate)) {
    return { error: "Move-in date must be a valid date (YYYY-MM-DD)" };
  }
  if (!SLEEP_SCHEDULES.includes(sleepSchedule)) {
    return { error: 'Sleep schedule must be "early", "late" or "flexible"' };
  }
  if (!PETS.includes(pets)) {
    return { error: 'Pets must be "has", "ok" or "no"' };
  }
  if (typeof smoking !== "boolean") {
    return { error: "Smoking must be true or false" };
  }
  if (!isText(bio, 1, 500)) {
    return { error: "Bio is required and must be at most 500 characters" };
  }

  return {
    value: {
      budget,
      neighborhoods,
      moveInDate: new Date(moveInDate),
      sleepSchedule,
      pets,
      smoking,
      bio: bio.trim(),
    },
  };
}

// Body of PATCH /api/roommates/:id/visibility. Only a real true or false
// is accepted, not "true" or 1.
export function validateVisibility(body) {
  const hidden = body?.hidden;
  if (typeof hidden !== "boolean") {
    return { error: "Hidden must be true or false" };
  }
  return { value: hidden };
}
