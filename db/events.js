// db/events.js
const { v4: uuidv4 } = require("uuid");

async function createEvent(pool, { title, date, location, description, spots_available }) {
  const id = uuidv4();
  const query = `
    INSERT INTO events (id, title, date, location, description, spots_available)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [id, title, date, location, description, spots_available];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getAllEvents(pool) {
  const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
  return result.rows;
}

async function getEventById(pool, id) {
  const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
  return result.rows[0];
}

async function deleteEvent(pool, id) {
  const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent
};
