// Creates the demo account and 100 synthetic students.
// Only users marked seeded: true are replaced. Real sign ups are kept.
import "dotenv/config";
import { closeDB, connectDB } from "../db/connection.js";
import { createIndexes } from "../db/indexes.js";
import { hashPassword } from "../auth/password.js";
import {
  DEMO_USER_EMAIL,
  DEMO_USER_NAME,
  DEMO_USER_PASSWORD,
} from "../constants/demoUser.js";
import { seededUserId, setUpFaker } from "./seedConfig.js";

const SEEDED_USER_COUNT = 100;

const faker = setUpFaker();
const db = await connectDB();
await createIndexes();
const users = db.collection("users");

// One hash for every seeded account keeps the script fast. Only the demo
// account's password is published in the README.
const { salt, passwordHash } = await hashPassword(DEMO_USER_PASSWORD);
const createdAt = new Date("2026-10-01T00:00:00Z");

const docs = [
  {
    _id: seededUserId(1),
    name: DEMO_USER_NAME,
    email: DEMO_USER_EMAIL,
    passwordHash,
    salt,
    seeded: true,
    createdAt,
  },
];
for (let n = 2; n <= SEEDED_USER_COUNT + 1; n++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const handle = `${firstName}.${lastName}`
    .toLowerCase()
    .replace(/[^a-z.]/g, "");
  docs.push({
    _id: seededUserId(n),
    name: `${firstName} ${lastName}`,
    // A domain no real student uses, so it never clashes with a sign up.
    email: `${handle}${n}@seed.subletboard.app`,
    passwordHash,
    salt,
    seeded: true,
    createdAt,
  });
}

const { deletedCount } = await users.deleteMany({ seeded: true });
await users.insertMany(docs);
console.log(
  `Users: removed ${deletedCount} seeded, added ${docs.length} (demo: ${DEMO_USER_EMAIL})`,
);
await closeDB();
