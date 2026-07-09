const Product = require("../models/Product");
const { checkCpuMotherboard } = require("../services/compatibilityService");

const checkCompatibility = async (req, res) => {
  try {
    const { cpuId, motherboardId } = req.body;

    if (!cpuId || !motherboardId) {
      return res.status(400).json({ message: "cpuId and motherboardId are required" });
    }

    const cpu = await Product.findById(cpuId);
    const motherboard = await Product.findById(motherboardId);

    if (!cpu || !motherboard) {
      return res.status(404).json({ message: "CPU or Motherboard not found" });
    }

    if (cpu.category !== "CPU") {
      return res.status(400).json({ message: "Provided cpuId is not a CPU category product" });
    }

    if (motherboard.category !== "Motherboard") {
      return res.status(400).json({ message: "Provided motherboardId is not a Motherboard category product" });
    }

    const result = checkCpuMotherboard(cpu, motherboard);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { checkCompatibility };