import { Router } from "express";
import { ObjectId } from "mongodb";
import httpError from "../utils/httpError.js";
import { buildRoommateQuery } from "../utils/buildRoommateQuery.js";
import { findRoommateById, searchRoommates } from "../db/roommatesDB.js";

// Roommate profiles API (Yanli Wang).
const router = Router();

function parseId(id) {
  return /^[0-9a-f]{24}$/i.test(id) ? new ObjectId(id) : null;
}

const isOwner = (profile, user) =>
  Boolean(user) && profile.authorId.equals(user._id);

// GET /api/roommates?neighborhood=&minBudget=&maxBudget=&moveInFrom=&moveInTo=&sleep=&pets=&smoking=&sort=&page=&limit=
// Hidden profiles are left out. Results never include the contact email.
router.get("/", async (req, res) => {
  const query = buildRoommateQuery(req.query);
  if (query.error) throw httpError(400, query.error);
  res.json(await searchRoommates(query));
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

export default router;
