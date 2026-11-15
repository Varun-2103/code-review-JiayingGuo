import { Router } from "express";
import passport from "../auth/passport.js";
import { hashPassword } from "../auth/password.js";
import { createUser, findUserByEmail, toPublicUser } from "../db/usersDB.js";
import { isValidEmail, normalizeEmail } from "../utils/email.js";

const router = Router();

const DUPLICATE_KEY = 11000;

function validateSignup({ name, email, password }) {
  if (typeof name !== "string" || !name.trim() || name.trim().length > 50) {
    return "Name is required and must be at most 50 characters";
  }
  if (typeof email !== "string" || !isValidEmail(normalizeEmail(email))) {
    return "Please enter a valid email";
  }
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 100
  ) {
    return "Password must be 8 to 100 characters";
  }
  return null;
}

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  const body = req.body ?? {};
  const error = validateSignup(body);
  if (error) return res.status(400).json({ error });

  const email = normalizeEmail(body.email);
  try {
    if (await findUserByEmail(email)) {
      return res
        .status(409)
        .json({ error: "This email is already registered" });
    }
    const { salt, passwordHash } = await hashPassword(body.password);
    const user = await createUser({
      name: body.name.trim(),
      email,
      passwordHash,
      salt,
    });
    const publicUser = toPublicUser(user);
    req.login(publicUser, (err) => {
      if (err) return next(err);
      res.status(201).json(publicUser);
    });
  } catch (err) {
    // Two sign ups with the same email at the same moment
    if (err.code === DUPLICATE_KEY) {
      return res
        .status(409)
        .json({ error: "This email is already registered" });
    }
    next(err);
  }
});

// POST /api/auth/login
// With a custom callback Passport only checks the password, so we call
// req.login ourselves to start the session, and we can answer with JSON.
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json(user);
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  res.json(req.user ?? null);
});

export default router;
