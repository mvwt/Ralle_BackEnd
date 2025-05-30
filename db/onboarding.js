const { v4: uuidv4 } = require("uuid");

async function saveOnboardingAnswers(pool, userId, answers) {
  const id = uuidv4();
  const {
    lifestyle_tags,
    supports_brand_values,
    sustainability_choice,
    active_reasons,
    custom_reason,
    max_shoe_budget,
    heard_from,
  } = answers;

  const query = `
    INSERT INTO onboarding_answers (
      id, user_id, lifestyle_tags, supports_brand_values, sustainability_choice,
      active_reasons, custom_reason, max_shoe_budget, heard_from
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    id, userId, lifestyle_tags, supports_brand_values, sustainability_choice,
    active_reasons, custom_reason, max_shoe_budget, heard_from
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getOnboardingAnswersByUser(pool, userId) {
  const result = await pool.query(
    `SELECT * FROM onboarding_answers WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  saveOnboardingAnswers,
  getOnboardingAnswersByUser,
};
