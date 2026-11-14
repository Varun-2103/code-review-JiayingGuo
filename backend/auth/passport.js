import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ObjectId } from "mongodb";
import { findUserByEmail, findUserById, toPublicUser } from "../db/usersDB.js";
import { verifyPassword } from "./password.js";
import { normalizeEmail } from "../utils/email.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        if (typeof email !== "string" || typeof password !== "string") {
          return done(null, false);
        }
        const user = await findUserByEmail(normalizeEmail(email));
        if (!user) return done(null, false);

        const matches = await verifyPassword(
          password,
          user.salt,
          user.passwordHash,
        );
        return done(null, matches ? toPublicUser(user) : false);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// The session only stores the user id.
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// An old cookie can point to a user that no longer exists (for example after
// seeding again). Treat it as logged out instead of failing every request.
passport.deserializeUser(async (id, done) => {
  try {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      return done(null, false);
    }
    const user = await findUserById(new ObjectId(id));
    done(null, user ? toPublicUser(user) : false);
  } catch (err) {
    done(err);
  }
});

export default passport;
