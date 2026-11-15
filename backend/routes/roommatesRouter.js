import { Router } from "express";
import { getDB } from "../db/connection.js";

// Starting point for the roommate profiles feature (Yanli Wang).
// It lists the roommates collection page by page, in the same shape as
// GET /api/sublets, so the frontend can use it the same way.
const router = Router();
const PAGE_SIZE = 12;

// GET /api/roommates?page=1
router.get("/", async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const collection = getDB().collection("roommates");
  const [items, total] = await Promise.all([
    collection
      .find({})
      .sort({ _id: 1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    collection.countDocuments({}),
  ]);
  res.json({ items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) });
});

export default router;
