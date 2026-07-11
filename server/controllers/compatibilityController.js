const Product = require("../models/Product");
const {
  checkCpuMotherboard,
  checkRamMotherboard,
} = require("../services/compatibilityService");

const checkCompatibility = async (req, res) => {
  try {
    const { productAId, productBId } = req.body;

    if (!productAId || !productBId) {
      return res.status(400).json({ message: "productAId and productBId are required" });
    }

    const productA = await Product.findById(productAId);
    const productB = await Product.findById(productBId);

    if (!productA || !productB) {
      return res.status(404).json({ message: "One or both products not found" });
    }

    const categories = [productA.category, productB.category].sort();

    // Route to the correct compatibility check based on category pair
    if (categories[0] === "CPU" && categories[1] === "Motherboard") {
      const cpu = productA.category === "CPU" ? productA : productB;
      const motherboard = productA.category === "Motherboard" ? productA : productB;
      return res.status(200).json(checkCpuMotherboard(cpu, motherboard));
    }

    if (categories[0] === "Motherboard" && categories[1] === "RAM") {
      const ram = productA.category === "RAM" ? productA : productB;
      const motherboard = productA.category === "Motherboard" ? productA : productB;
      return res.status(200).json(checkRamMotherboard(ram, motherboard));
    }

    return res.status(400).json({
      message: `No compatibility rule exists yet for category pair: ${categories[0]} + ${categories[1]}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { checkCompatibility };