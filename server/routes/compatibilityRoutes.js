const express = require("express");
const { checkCompatibility } = require("../controllers/compatibilityController");

const router = express.Router();

router.post("/check", checkCompatibility);

module.exports = router;