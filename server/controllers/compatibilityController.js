const Product = require("../models/Product");
const {
  checkCpuMotherboard,
  checkRamMotherboard,
  checkPsuWattage,
} = require("../services/compatibilityService");

const checkCompatibility = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ message: "productIds must be an array of at least 2 product IDs" });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(404).json({ message: "One or more products not found" });
    }

    const categorySignature = products
      .map((p) => p.category)
      .sort()
      .join("+");

    const findByCategory = (cat) => products.find((p) => p.category === cat);

    switch (categorySignature) {
      case "CPU+Motherboard":
        return res.status(200).json(
          checkCpuMotherboard(findByCategory("CPU"), findByCategory("Motherboard"))
        );

      case "Motherboard+RAM":
        return res.status(200).json(
          checkRamMotherboard(findByCategory("RAM"), findByCategory("Motherboard"))
        );

      case "CPU+GPU+PSU":
        return res.status(200).json(
          checkPsuWattage(findByCategory("CPU"), findByCategory("GPU"), findByCategory("PSU"))
        );

      default:
        return res.status(400).json({
          message: `No compatibility rule exists yet for category combination: ${categorySignature}`,
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { checkCompatibility };