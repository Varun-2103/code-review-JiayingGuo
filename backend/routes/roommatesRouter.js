import { Router } from "express";
import { ObjectId } from "mongodb";
import requireAuth from "../middleware/requireAuth.js";
import httpError from "../utils/httpError.js";
import { buildRoommateQuery } from "../utils/buildRoommateQuery.js";
import {
  validateRoommate,
  validateVisibility,
} from "../utils/validateRoommate.js";
import {
  deleteRoommate,
  findRoommateByAuthor,
  findRoommateById,
  insertRoommate,
  searchRoommates,
  updateRoommate,
} from "../db/roommatesDB.js";

// Roommate profiles API (Yanli Wang).
const router = Router();

function parseId(id) {
  return /^[0-9a-f]{24}$/i.test(id) ? new ObjectId(id) : null;
}

const isOwner = (profile, user) =>
  Boolean(user) && profile.authorId.equals(user._id);

const DUPLICATE_KEY = 11000;
const ONE_PROFILE = "You already have a roommate profile. Edit it instead";

// Loads a profile for a change. Order: 404, then 403.
async function findOwnRoommate(req) {
  const id = parseId(req.params.id);
  const profile = id && (await findRoommateById(id));
  if (!profile) throw httpError(404, "Profile not found");
  if (!isOwner(profile, req.user)) {
    throw httpError(403, "You can only change your own profile");
  }
  return profile;
}

// GET /api/roommates?neighborhood=&minBudget=&maxBudget=&moveInFrom=&moveInTo=&sleep=&pets=&smoking=&sort=&page=&limit=
// Hidden profiles are left out. Results never include the contact email.
router.get("/", async (req, res) => {
  const query = buildRoommateQuery(req.query);
  if (query.error) throw httpError(400, query.error);
  res.json(await searchRoommates(query));
});

// GET /api/roommates/mine (must stay above /:id)
// The logged-in student's own profile, hidden or not, or null if they have
// none yet.
router.get("/mine", requireAuth, async (req, res) => {
  const profile = await findRoommateByAuthor(req.user._id);
  res.json(profile && { ...profile, isOwner: true, contactHidden: false });
});

// GET /api/roommates/:id (routes like /mine must stay above this one)
// A hidden profile is only shown to its author. Everyone else gets 404, so
// they cannot tell it exists. The contact email is shown to logged-in
// students. The author always sees it.
router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  const profile = id && (await findRoommateById(id));
  const owner = Boolean(profile) && isOwner(profile, req.user);
  if (!profile || (profile.hidden && !owner)) {
    throw httpError(404, "Profile not found");
  }

  const showEmail = owner || Boolean(req.user);
  const { authorEmail, ...rest } = profile;
  res.json({
    ...rest,
    ...(showEmail && { authorEmail }),
    isOwner: owner,
    contactHidden: !showEmail,
  });
});

// POST /api/roommates
// Each student has one profile. The unique index on authorId also catches
// two requests sent at the same time.
router.post("/", requireAuth, async (req, res) => {
  const { error, value } = validateRoommate(req.body);
  if (error) throw httpError(400, error);
  if (await findRoommateByAuthor(req.user._id)) {
    throw httpError(409, ONE_PROFILE);
  }

  const now = new Date();
  try {
    const profile = await insertRoommate({
      ...value,
      hidden: false,
      authorId: req.user._id,
      authorName: req.user.name,
      authorEmail: req.user.email,
      seeded: false,
      createdAt: now,
      updatedAt: now,
    });
    res.status(201).json({ ...profile, isOwner: true, contactHidden: false });
  } catch (err) {
    if (err.code === DUPLICATE_KEY) throw httpError(409, ONE_PROFILE);
    throw err;
  }
});

// PUT /api/roommates/:id (only the form fields can change, not hidden)
router.put("/:id", requireAuth, async (req, res) => {
  const profile = await findOwnRoommate(req);
  const { error, value } = validateRoommate(req.body);
  if (error) throw httpError(400, error);

  const updated = await updateRoommate(profile._id, value);
  res.json({ ...updated, isOwner: true, contactHidden: false });
});

// PATCH /api/roommates/:id/visibility
// { hidden: true } hides the profile from search, { hidden: false } shows it
// again. This is the only route that changes hidden.
router.patch("/:id/visibility", requireAuth, async (req, res) => {
  const profile = await findOwnRoommate(req);
  const { error, value } = validateVisibility(req.body);
  if (error) throw httpError(400, error);

  const updated = await updateRoommate(profile._id, { hidden: value });
  res.json({ ...updated, isOwner: true, contactHidden: false });
});

// DELETE /api/roommates/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const profile = await findOwnRoommate(req);
  await deleteRoommate(profile._id);
  res.json({ ok: true });
});

export default router;
