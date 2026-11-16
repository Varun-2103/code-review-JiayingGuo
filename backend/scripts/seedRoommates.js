// Creates 1,200 synthetic roommate profiles, one for each synthetic student,
// plus one for the demo account so My profile can be shown in the demo.
// Only profiles marked seeded: true are replaced. Real profiles are kept.
//
// This script does not read the users collection: the roommate feature is
// independent of the sublet feature. Each synthetic profile gets its own
// Faker name, email and a fixed author id outside the range seed:users uses.
import "dotenv/config";
import { ObjectId } from "mongodb";
import { closeDB, connectDB } from "../db/connection.js";
import { createIndexes } from "../db/indexes.js";
import {
  DEMO_USER_EMAIL,
  DEMO_USER_ID,
  DEMO_USER_NAME,
} from "../constants/demoUser.js";
import { seededUserId, setUpFaker } from "./seedConfig.js";
import { generateRoommate } from "./generateRoommate.js";

const ROOMMATE_COUNT = 1200;
const HIDDEN_SHARE = 0.1;
// seed:users uses ids 1 to 101, so roommate authors start far above that.
const FIRST_AUTHOR_NUMBER = 10001;

const faker = setUpFaker();
const db = await connectDB();
await createIndexes();

const docs = [
  generateRoommate(
    faker,
    {
      _id: new ObjectId(DEMO_USER_ID),
      name: DEMO_USER_NAME,
      email: DEMO_USER_EMAIL,
    },
    false,
  ),
];

for (let i = 0; i < ROOMMATE_COUNT; i++) {
  const n = FIRST_AUTHOR_NUMBER + i;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const handle = `${firstName}.${lastName}`
    .toLowerCase()
    .replace(/[^a-z.]/g, "");
  const author = {
    _id: seededUserId(n),
    name: `${firstName} ${lastName}`,
    // A domain no real student uses, so it never clashes with a sign up.
    email: `${handle}${n}@seed.subletboard.app`,
  };
  const hidden = faker.datatype.boolean({ probability: HIDDEN_SHARE });
  docs.push(generateRoommate(faker, author, hidden));
}

const roommates = db.collection("roommates");
const { deletedCount } = await roommates.deleteMany({ seeded: true });
// If the demo account already made its own profile in the app, keep it
// (one profile per student) and skip the seeded one.
const demoHasProfile = await roommates.findOne({
  authorId: new ObjectId(DEMO_USER_ID),
});
if (demoHasProfile) docs.shift();
await roommates.insertMany(docs);
const hiddenCount = docs.filter((d) => d.hidden).length;
console.log(
  `Roommates: removed ${deletedCount} seeded, added ${docs.length} (${hiddenCount} hidden, demo: ${DEMO_USER_EMAIL})`,
);
await closeDB();
