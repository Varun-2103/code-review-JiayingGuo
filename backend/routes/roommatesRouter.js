import { Router } from "express";
import httpError from "../utils/httpError.js";
import { buildRoommateQuery } from "../utils/buildRoommateQuery.js";
import { searchRoommates } from "../db/roommatesDB.js";

// Roommate profiles API (Yanli Wang).
const router = Router();

// GET /api/roommates?neighborhood=&minBudget=&maxBudget=&moveInFrom=&moveInTo=&sleep=&pets=&smoking=&sort=&page=&limit=
// Hidden profiles are left out. Results never include the contact email.
router.get("/", async (req, res) => {
  const query = buildRoommateQuery(req.query);
  if (query.error) throw httpError(400, query.error);
  res.json(await searchRoommates(query));
});

export default router;
