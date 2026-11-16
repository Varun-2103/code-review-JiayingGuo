import { getDB } from "./connection.js";

const roommates = () => getDB().collection("roommates");

// Search results never include the contact email or internal fields.
const LIST_PROJECTION = { authorEmail: 0, seeded: 0 };

// The caller builds the filter. It should include hidden: false so hidden
// profiles never show up in search.
export async function searchRoommates({ filter, sort, page, limit }) {
  const [items, total] = await Promise.all([
    roommates()
      .find(filter, { projection: LIST_PROJECTION })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    roommates().countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export function findRoommateById(id) {
  return roommates().findOne({ _id: id }, { projection: { seeded: 0 } });
}

// Each student has at most one profile (unique index on authorId).
export function findRoommateByAuthor(authorId) {
  return roommates().findOne({ authorId }, { projection: { seeded: 0 } });
}

// Returns the saved profile as clients see it (without internal fields).
// Throws a duplicate key error (code 11000) if the author already has one.
export async function insertRoommate(profile) {
  const result = await roommates().insertOne(profile);
  return findRoommateById(result.insertedId);
}

// Returns the updated document (driver 6+ returns the document directly).
export function updateRoommate(id, fields) {
  return roommates().findOneAndUpdate(
    { _id: id },
    { $set: { ...fields, updatedAt: new Date() } },
    { returnDocument: "after", projection: { seeded: 0 } },
  );
}

export function deleteRoommate(id) {
  return roommates().deleteOne({ _id: id });
}
