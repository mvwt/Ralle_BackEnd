// db/users.js
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const JWT_SECRET = process.env.JWT_SECRET;

async function createUser({ name, email, password }) {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (id, name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, created_at;
  `;
  const result = await pool.query(query, [id, name, email, hashedPassword]);
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query("SELECT id, name, email, created_at FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function updateUser(id, updates) {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${i++}`);
    values.push(value);
  }

  values.push(id);
  const query = `
    UPDATE users SET ${fields.join(", ")}
    WHERE id = $${i}
    RETURNING id, name, email, created_at;
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
}

async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  authenticateUser
};
