const express = require("express");
const { testAi, buildSuggestion } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/test", protect, testAi);
router.post("/build-suggestion", protect, buildSuggestion);

module.exports = router;