import { getDB } from "./connection.js";

// Called on every server start. createIndex does nothing if the index
// already exists, so a fresh database always gets the unique email index.
export async function createIndexes() {
  const db = getDB();
  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  const sublets = db.collection("sublets");
  await Promise.all([
    sublets.createIndex({ status: 1, neighborhood: 1, rent: 1 }),
    sublets.createIndex({ authorId: 1 }),
    sublets.createIndex({ startDate: 1, endDate: 1 }),
  ]);

  const roommates = db.collection("roommates");
  await Promise.all([
    // One profile per student.
    roommates.createIndex({ authorId: 1 }, { unique: true }),
    roommates.createIndex({ hidden: 1, budget: 1 }),
    // Multikey index: matches a profile if any preferred neighborhood matches.
    roommates.createIndex({ neighborhoods: 1 }),
    roommates.createIndex({ moveInDate: 1 }),
  ]);
}
