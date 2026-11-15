import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, KEY_LENGTH);
  return { salt, passwordHash: hash.toString("hex") };
}

export async function verifyPassword(password, salt, passwordHash) {
  const expected = Buffer.from(passwordHash, "hex");
  const actual = await scrypt(password, salt, KEY_LENGTH);
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}
