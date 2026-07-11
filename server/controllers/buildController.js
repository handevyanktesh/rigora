const Build = require("../models/Build");

// @route POST /api/builds
const createBuild = async (req, res) => {
  try {
    const { name, components } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Build name is required" });
    }

    const build = await Build.create({
      user: req.user._id,
      name,
      components: components || {},
    });

    res.status(201).json(build);
  } catch (error) {
    res.status(400).json({ message: "Invalid build data", error: error.message });
  }
};

// @route GET /api/builds
const getMyBuilds = async (req, res) => {
  try {
    const builds = await Build.find({ user: req.user._id }).populate(
      Object.keys(buildComponentPaths()).map((key) => `components.${key}`)
    );
    res.status(200).json(builds);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper to avoid repeating this list everywhere
function buildComponentPaths() {
  return {
    cpu: true, motherboard: true, ram: true, gpu: true,
    psu: true, storage: true, case: true, cooler: true,
  };
}

// @route GET /api/builds/:id
const getBuildById = async (req, res) => {
  try {
    const build = await Build.findById(req.params.id).populate(
      Object.keys(buildComponentPaths()).map((key) => `components.${key}`)
    );

    if (!build) {
      return res.status(404).json({ message: "Build not found" });
    }

    // Ownership check — a user can only view THEIR OWN build
    if (build.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this build" });
    }

    res.status(200).json(build);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/builds/:id
const updateBuild = async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ message: "Build not found" });
    }

    if (build.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this build" });
    }

    const { name, components } = req.body;
    if (name) build.name = name;
    if (components) build.components = { ...build.components.toObject(), ...components };

    await build.save();
    res.status(200).json(build);
  } catch (error) {
    res.status(400).json({ message: "Invalid update data", error: error.message });
  }
};

// @route DELETE /api/builds/:id
const deleteBuild = async (req, res) => {
  try {
    const build = await Build.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ message: "Build not found" });
    }

    if (build.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this build" });
    }

    await build.deleteOne();
    res.status(200).json({ message: "Build deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createBuild, getMyBuilds, getBuildById, updateBuild, deleteBuild };