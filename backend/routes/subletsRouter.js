import { Router } from "express";
import { ObjectId } from "mongodb";
import requireAuth from "../middleware/requireAuth.js";
import httpError from "../utils/httpError.js";
import { buildSubletQuery } from "../utils/buildSubletQuery.js";
import { validateStatus, validateSublet } from "../utils/validateSublet.js";
import {
  deleteSublet,
  findSubletById,
  findSubletsByAuthor,
  insertSublet,
  searchSublets,
  updateSublet,
} from "../db/subletsDB.js";

const router = Router();

function parseId(id) {
  return /^[0-9a-f]{24}$/i.test(id) ? new ObjectId(id) : null;
}

const isOwner = (sublet, user) =>
  Boolean(user) && sublet.authorId.equals(user._id);

// Loads a listing for a change. Order: 404, then 403.
async function findOwnSublet(req) {
  const id = parseId(req.params.id);
  const sublet = id && (await findSubletById(id));
  if (!sublet) throw httpError(404, "Listing not found");
  if (!isOwner(sublet, req.user)) {
    throw httpError(403, "You can only change your own listings");
  }
  return sublet;
}

// GET /api/sublets?neighborhood=&minRent=&maxRent=&moveIn=&moveOut=&furnished=&sort=&page=&limit=
router.get("/", async (req, res) => {
  const query = buildSubletQuery(req.query);
  if (query.error) throw httpError(400, query.error);
  res.json(await searchSublets(query));
});

// GET /api/sublets/mine (must stay above /:id)
router.get("/mine", requireAuth, async (req, res) => {
  res.json({ items: await findSubletsByAuthor(req.user._id) });
});

// GET /api/sublets/:id
// The contact email is shown to logged-in students while the listing is
// available. The author always sees it.
router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  const sublet = id && (await findSubletById(id));
  if (!sublet) throw httpError(404, "Listing not found");

  const owner = isOwner(sublet, req.user);
  const showEmail = owner || (req.user && sublet.status === "available");
  const { authorEmail, ...rest } = sublet;
  res.json({
    ...rest,
    ...(showEmail && { authorEmail }),
    isOwner: owner,
    contactHidden: !showEmail,
  });
});

// POST /api/sublets
router.post("/", requireAuth, async (req, res) => {
  const { error, value } = validateSublet(req.body);
  if (error) throw httpError(400, error);

  const now = new Date();
  const sublet = await insertSublet({
    ...value,
    status: "available",
    authorId: req.user._id,
    authorName: req.user.name,
    authorEmail: req.user.email,
    seeded: false,
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json({ ...sublet, isOwner: true, contactHidden: false });
});

// PUT /api/sublets/:id (only the form fields can change)
router.put("/:id", requireAuth, async (req, res) => {
  const sublet = await findOwnSublet(req);
  const { error, value } = validateSublet(req.body);
  if (error) throw httpError(400, error);

  const updated = await updateSublet(sublet._id, value);
  res.json({ ...updated, isOwner: true, contactHidden: false });
});

// PATCH /api/sublets/:id/status
router.patch("/:id/status", requireAuth, async (req, res) => {
  const sublet = await findOwnSublet(req);
  const { error, value } = validateStatus(req.body);
  if (error) throw httpError(400, error);

  const updated = await updateSublet(sublet._id, { status: value });
  res.json({ ...updated, isOwner: true, contactHidden: false });
});

// DELETE /api/sublets/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const sublet = await findOwnSublet(req);
  await deleteSublet(sublet._id);
  res.json({ ok: true });
});

export default router;
