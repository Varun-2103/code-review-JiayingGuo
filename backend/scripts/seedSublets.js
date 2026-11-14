// Creates 1,200 synthetic sublet listings written by the seeded users.
// Only listings marked seeded: true are replaced. Real listings are kept.
// Run seed:users first (npm run seed runs both).
import "dotenv/config";
import { closeDB, connectDB } from "../db/connection.js";
import { createIndexes } from "../db/indexes.js";
import { DEMO_USER_ID } from "../constants/demoUser.js";
import { setUpFaker } from "./seedConfig.js";
import { generateSublet } from "./generateSublet.js";

const SUBLET_COUNT = 1200;
const DEMO_LISTING_COUNT = 6;

const faker = setUpFaker();
const db = await connectDB();
await createIndexes();

// Sorted by _id: find() has no fixed order, and the order decides which
// author faker picks for each listing.
const authors = await db
  .collection("users")
  .find({ seeded: true }, { projection: { name: 1, email: 1 } })
  .sort({ _id: 1 })
  .toArray();
const demo = authors.find((u) => u._id.toString() === DEMO_USER_ID);
const others = authors.filter((u) => u !== demo);
if (!demo || others.length === 0) {
  console.error("No seeded users found. Run npm run seed:users first.");
  process.exit(1);
}

const docs = [];
for (let i = 0; i < SUBLET_COUNT; i++) {
  const author =
    i < DEMO_LISTING_COUNT ? demo : faker.helpers.arrayElement(others);
  docs.push(generateSublet(faker, author, i));
}

const sublets = db.collection("sublets");
const { deletedCount } = await sublets.deleteMany({ seeded: true });
await sublets.insertMany(docs);
console.log(`Sublets: removed ${deletedCount} seeded, added ${docs.length}`);
await closeDB();
