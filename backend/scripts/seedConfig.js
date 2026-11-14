import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

// Same seed and reference date every run, so the data is the same every run.
// Without the reference date, faker's dates move with the current time.
export function setUpFaker() {
  faker.seed(5610);
  faker.setDefaultRefDate("2026-11-01T00:00:00Z");
  return faker;
}

// Seeded users get fixed ids: 000...0001 is the demo account, then
// 000...0002, 000...0003 and so on.
export function seededUserId(n) {
  return new ObjectId(n.toString(16).padStart(24, "0"));
}
