const express = require("express");
const router = express.Router();
const { assignUserMembership, getUserMembership } = require("../db/user_memberships");

// POST /api/user-memberships
router.post("/", async (req, res) => {
  const { user_id, membership_id, end_date } = req.body;

  if (!user_id || !membership_id) {
    return res.status(400).json({ error: "user_id and membership_id required" });
  }

  try {
    const newMembership = await assignUserMembership(
      req.app.locals.pool,
      user_id,
      membership_id,
      end_date || null
    );
    res.status(201).json(newMembership);
  } catch (err) {
    console.error("Error assigning user membership:", err);
    res.status(500).json({ error: "Could not assign membership" });
  }
});

// GET /api/user-memberships/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userMembership = await getUserMembership(req.app.locals.pool, req.params.userId);
    if (!userMembership) {
      return res.status(404).json({ error: "No membership found for user" });
    }
    res.json(userMembership);
  } catch (err) {
    console.error("Error retrieving user membership:", err);
    res.status(500).json({ error: "Failed to fetch membership" });
  }
});

module.exports = router;
