async function getAllMemberships(pool) {
  const result = await pool.query("SELECT * FROM memberships ORDER BY price ASC");
  return result.rows;
}

async function getMembershipById(pool, id) {
  const result = await pool.query("SELECT * FROM memberships WHERE id = $1", [id]);
  return result.rows[0];
}

module.exports = {
  getAllMemberships,
  getMembershipById,
};
