const express = require("express");
const router = express.Router();
const gear = require("../db/gear");
const pool = require("../db");

// Get all gear items
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM gear ORDER BY name");
    const cleaned = result.rows.map(row => ({
      ...row,
      price: parseFloat(row.price) // convert price string to number
    }));
    res.json(cleaned);
  } catch (err) {
    console.error("Error fetching gear:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Place a gear order
router.post("/order", async (req, res) => {
  const { userId, gearId, quantity } = req.body;
  if (!userId || !gearId || !quantity) {
    return res.status(400).json({ error: "Missing order fields" });
  }

  try {
    const order = await gear.createOrder(
      pool, userId, itemId, quantity);
    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
