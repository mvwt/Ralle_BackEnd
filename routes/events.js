// routes/events.js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent
} = require("../db/events");

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const events = await getAllEvents(req.app.locals.pool);
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/events/:id
router.get("/:id", async (req, res) => {
  try {
    const event = await getEventById(req.app.locals.pool, req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Error getting event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/events
router.post("/", async (req, res) => {
  const { title, date, location, description, spots_available } = req.body;
  try {
    const newEvent = await createEvent(req.app.locals.pool, {
      title,
      date,
      location,
      description,
      spots_available
    });
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteEvent(req.app.locals.pool, req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
