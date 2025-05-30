// routes/users.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  authenticateUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
} = require("../db/users");

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// POST /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existing = await getUserByEmail(email);
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const user = await createUser({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authenticateUser(email, password);
    if (!result)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json(result);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    res.json(user);
  } catch (err) {
    console.error("Fetch me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/me
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const updated = await updateUser(req.user.userId, req.body);
    res.json(updated);
  } catch (err) {
    console.error("Update me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/users/me
router.delete("/me", authenticateToken, async (req, res) => {
  try {
    const removed = await deleteUser(req.user.userId);
    res.json({ message: "User deleted", id: removed.id });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
