module.exports = {
    getAllItems: async (pool) => {
      const result = await pool.query("SELECT * FROM gear_items ORDER BY name");
      return result.rows;
    },
  
    getOrdersByUser: async (pool, userId) => {
      const result = await pool.query(
        `SELECT o.*, m.name, m.price FROM gear_orders o
         JOIN gear_items m ON o.item_id = m.id
         WHERE o.user_id = $1`,
        [userId]
      );
      return result.rows;
    },
  
    createOrder: async (pool, userId, itemId, quantity) => {
      const result = await pool.query(
        `INSERT INTO gear_orders (user_id, item_id, quantity)
         VALUES ($1, $2, $3) RETURNING *`,
        [userId, itemId, quantity]
      );
      return result.rows[0];
    }
  };
  