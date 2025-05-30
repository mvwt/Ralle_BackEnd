// db/eventRegistrations.js
async function registerUserForEvent(pool, userId, eventId) {
    const query = `
      INSERT INTO event_registrations (user_id, event_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, eventId]);
    return result.rows[0];
  }
  
  async function getUserRegistrations(pool, userId) {
    const query = `
      SELECT e.*
      FROM events e
      JOIN event_registrations er ON e.id = er.event_id
      WHERE er.user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
  
  module.exports = {
    registerUserForEvent,
    getUserRegistrations
  };
  