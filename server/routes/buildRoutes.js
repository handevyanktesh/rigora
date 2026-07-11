const express = require("express");
const {
  createBuild,
  getMyBuilds,
  getBuildById,
  updateBuild,
  deleteBuild,
} = require("../controllers/buildController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBuild);
router.get("/", protect, getMyBuilds);
router.get("/:id", protect, getBuildById);
router.put("/:id", protect, updateBuild);
router.delete("/:id", protect, deleteBuild);

module.exports = router;