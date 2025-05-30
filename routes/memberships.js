const express = require("express");
const router = express.Router();
const { getAllMemberships, getMembershipById } = require("../db/memberships");

// GET /api/memberships
router.get("/", async (req, res) => {
  try {
    const memberships = await getAllMemberships(req.app.locals.pool);
    res.json(memberships);
  } catch (err) {
    console.error("Error fetching memberships:", err);
    res.status(500).json({ error: "Failed to load memberships" });
  }
});

// GET /api/memberships/:id
router.get("/:id", async (req, res) => {
  try {
    const membership = await getMembershipById(req.app.locals.pool, req.params.id);
    if (!membership) {
      return res.status(404).json({ error: "Membership not found" });
    }
    res.json(membership);
  } catch (err) {
    console.error("Error fetching membership:", err);
    res.status(500).json({ error: "Failed to fetch membership" });
  }
});

module.exports = router;
