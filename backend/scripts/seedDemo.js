// Resets only the demo account's listings (for example after a class demo
// or peer review). Nothing else in the database changes.
import "dotenv/config";
import { ObjectId } from "mongodb";
import { closeDB, connectDB } from "../db/connection.js";
import { DEMO_USER_ID } from "../constants/demoUser.js";
import { setUpFaker } from "./seedConfig.js";
import { generateSublet } from "./generateSublet.js";

const DEMO_LISTING_COUNT = 6;

const faker = setUpFaker();
const db = await connectDB();

const demo = await db
  .collection("users")
  .findOne(
    { _id: new ObjectId(DEMO_USER_ID) },
    { projection: { name: 1, email: 1 } },
  );
if (!demo) {
  console.error("Demo account not found. Run npm run seed first.");
  process.exit(1);
}

// seed:sublets makes the demo listings first with the same faker seed, so
// this brings back exactly the same 6 listings.
const docs = [];
for (let i = 0; i < DEMO_LISTING_COUNT; i++) {
  docs.push(generateSublet(faker, demo, i));
}

const sublets = db.collection("sublets");
const { deletedCount } = await sublets.deleteMany({ authorId: demo._id });
await sublets.insertMany(docs);
console.log(
  `Demo listings: removed ${deletedCount}, added ${docs.length} for ${demo.email}`,
);
await closeDB();
