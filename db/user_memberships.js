const { v4: uuidv4 } = require("uuid");

async function assignUserMembership(pool, user_id, membership_id, end_date = null) {
  const id = uuidv4();
  const result = await pool.query(`
    INSERT INTO user_memberships (id, user_id, membership_id, end_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [id, user_id, membership_id, end_date]);
  return result.rows[0];
}

async function getUserMembership(pool, user_id) {
  const result = await pool.query(`
    SELECT um.*, m.name AS membership_name, m.price, m.benefits
    FROM user_memberships um
    JOIN memberships m ON um.membership_id = m.id
    WHERE um.user_id = $1
    ORDER BY um.start_date DESC
    LIMIT 1;
  `, [user_id]);
  return result.rows[0];
}

module.exports = {
  assignUserMembership,
  getUserMembership,
};
