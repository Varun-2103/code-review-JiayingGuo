import { getDB } from "./connection.js";

const users = () => getDB().collection("users");

// The only user fields that leave the server. Never send passwordHash or salt.
export function toPublicUser(user) {
  return { _id: user._id, name: user.name, email: user.email };
}

export function findUserByEmail(email) {
  return users().findOne({ email });
}

export function findUserById(id) {
  return users().findOne({ _id: id });
}

export async function createUser({ name, email, passwordHash, salt }) {
  const user = {
    name,
    email,
    passwordHash,
    salt,
    seeded: false,
    createdAt: new Date(),
  };
  const result = await users().insertOne(user);
  return { ...user, _id: result.insertedId };
}
