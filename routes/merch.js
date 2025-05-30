const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all merch items
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM merch ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching merch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Place a merch order
router.post("/order", async (req, res) => {
  const { userId, merchId, quantity } = req.body;
  if (!userId || !merchId || !quantity) {
    return res.status(400).json({ error: "Missing order fields" });
  }

  try {
    await pool.query(
      `INSERT INTO merch_orders (user_id, merch_id, quantity)
       VALUES ($1, $2, $3)`,
      [userId, merchId, quantity]
    );
    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
