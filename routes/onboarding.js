const express = require("express");
const router = express.Router();
const {
  saveOnboardingAnswers,
  getOnboardingAnswersByUser
} = require("../db/onboarding");

// POST /api/onboarding
router.post("/", async (req, res) => {
  const pool = req.app.locals.pool;
  const { user_id, lifestyle_tags, supports_brand_values, sustainability_choice, active_reasons, custom_reason, max_shoe_budget, heard_from } = req.body;

  try {
    const saved = await saveOnboardingAnswers(pool, user_id, {
      lifestyle_tags,
      supports_brand_values,
      sustainability_choice,
      active_reasons,
      custom_reason,
      max_shoe_budget,
      heard_from
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving onboarding answers:", err);
    res.status(500).json({ error: "Failed to save onboarding data" });
  }
});

// GET /api/onboarding/:userId
router.get("/:userId", async (req, res) => {
  const pool = req.app.locals.pool;
  const { userId } = req.params;

  try {
    const answers = await getOnboardingAnswersByUser(pool, userId);
    res.json(answers);
  } catch (err) {
    console.error("Error fetching onboarding answers:", err);
    res.status(500).json({ error: "Failed to fetch onboarding data" });
  }
});

module.exports = router;
