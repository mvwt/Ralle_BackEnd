// routes/eventRegistrations.js
const express = require("express");
const router = express.Router();
const {
  registerUserForEvent,
  getUserRegistrations
} = require("../db/eventRegistrations");

router.post("/register", async (req, res) => {
  const pool = req.app.locals.pool;
  const { userId, eventId } = req.body;

  try {
    const registration = await registerUserForEvent(pool, userId, eventId);
    res.status(201).json(registration);
  } catch (err) {
    console.error("Error registering for event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const pool = req.app.locals.pool;
  const { userId } = req.params;

  try {
    const events = await getUserRegistrations(pool, userId);
    res.json(events);
  } catch (err) {
    console.error("Error fetching user registrations:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
