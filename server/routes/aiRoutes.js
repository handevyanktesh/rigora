const express = require("express");
const { testAi } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/test", protect, testAi);

module.exports = router;