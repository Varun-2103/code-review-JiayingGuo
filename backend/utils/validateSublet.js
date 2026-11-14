import { NEIGHBORHOODS } from "../constants/neighborhoods.js";
import { isValidDateString } from "./dates.js";

const isWholeNumber = (n) => typeof n === "number" && Number.isInteger(n);
// A web link, or one of the sample room pictures the app ships with
// (used by the seed data, so it does not depend on an outside photo site).
const PHOTO_PATTERN = /^(https?:\/\/\S+|\/rooms\/room-\d{1,2}\.svg)$/i;
const isText = (s, min, max) =>
  typeof s === "string" && s.trim().length >= min && s.trim().length <= max;

// Checks a create or edit request. Only the fields below are read, so a
// request cannot set status, author fields or seeded.
// Returns { error } or { value } with clean values ready to save.
export function validateSublet(body) {
  if (!body || typeof body !== "object") {
    return { error: "Request body is required" };
  }
  const {
    title,
    neighborhood,
    rent,
    startDate,
    endDate,
    furnished,
    commuteMinutes,
    photoUrl = "",
    description,
  } = body;

  if (!isText(title, 1, 100)) {
    return { error: "Title is required and must be at most 100 characters" };
  }
  if (!NEIGHBORHOODS.includes(neighborhood)) {
    return { error: "Please choose a neighborhood from the list" };
  }
  if (!isWholeNumber(rent) || rent <= 0 || rent > 10000) {
    return { error: "Rent must be a whole number from 1 to 10000" };
  }
  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return { error: "Start and end dates must be valid dates (YYYY-MM-DD)" };
  }
  if (endDate <= startDate) {
    return { error: "End date must be after the start date" };
  }
  if (typeof furnished !== "boolean") {
    return { error: "Furnished must be true or false" };
  }
  if (
    !isWholeNumber(commuteMinutes) ||
    commuteMinutes < 0 ||
    commuteMinutes > 180
  ) {
    return {
      error: "Commute time must be a whole number of minutes from 0 to 180",
    };
  }
  if (
    typeof photoUrl !== "string" ||
    photoUrl.trim().length > 500 ||
    (photoUrl.trim() !== "" && !PHOTO_PATTERN.test(photoUrl.trim()))
  ) {
    return { error: "Photo link must start with http:// or https://" };
  }
  if (!isText(description, 1, 1000)) {
    return {
      error: "Description is required and must be at most 1000 characters",
    };
  }

  return {
    value: {
      title: title.trim(),
      neighborhood,
      rent,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      furnished,
      commuteMinutes,
      photoUrl: photoUrl.trim(),
      description: description.trim(),
    },
  };
}

export function validateStatus(body) {
  const status = body?.status;
  if (status !== "available" && status !== "rented") {
    return { error: 'Status must be "available" or "rented"' };
  }
  return { value: status };
}
