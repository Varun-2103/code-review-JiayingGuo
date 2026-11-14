import { getDB } from "./connection.js";

const sublets = () => getDB().collection("sublets");

// Search results never include the contact email or internal fields.
const LIST_PROJECTION = { authorEmail: 0, seeded: 0 };

export async function searchSublets({ filter, sort, page, limit }) {
  const [items, total] = await Promise.all([
    sublets()
      .find(filter, { projection: LIST_PROJECTION })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    sublets().countDocuments(filter),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export function findSubletById(id) {
  return sublets().findOne({ _id: id }, { projection: { seeded: 0 } });
}

export function findSubletsByAuthor(authorId) {
  return sublets()
    .find({ authorId }, { projection: { seeded: 0 } })
    .sort({ createdAt: -1, _id: -1 })
    .toArray();
}

// Returns the saved listing as clients see it (without internal fields).
export async function insertSublet(sublet) {
  const result = await sublets().insertOne(sublet);
  return findSubletById(result.insertedId);
}

// Returns the updated document (driver 6+ returns the document directly).
export function updateSublet(id, fields) {
  return sublets().findOneAndUpdate(
    { _id: id },
    { $set: { ...fields, updatedAt: new Date() } },
    { returnDocument: "after", projection: { seeded: 0 } },
  );
}

export function deleteSublet(id) {
  return sublets().deleteOne({ _id: id });
}
