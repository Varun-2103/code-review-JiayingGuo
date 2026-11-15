// Accepts only real calendar dates written as YYYY-MM-DD.
// new Date("2027-1-5") is read in local time and new Date("2027-02-30")
// rolls over to March 2, so the result is turned back into a string and
// compared with the input.
export function isValidDateString(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const date = new Date(s);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === s;
}
