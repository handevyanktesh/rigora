const { generateContent } = require("../services/geminiService");
const { getAiBuildSuggestion } = require("../services/aiBuilderService");
const Product = require("../models/Product");

const testAi = async (req, res) => {
  // ...unchanged from Breakdown 1
};

const buildSuggestion = async (req, res) => {
  try {
    const { budget, useCase } = req.body;

    if (!budget || !useCase) {
      return res.status(400).json({ message: "budget and useCase are required" });
    }

    const aiPicks = await getAiBuildSuggestion(budget, useCase);

    // Fetch full product details for whatever Gemini picked
    const productIds = Object.values(aiPicks);
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json({
      picks: aiPicks,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "AI build suggestion failed", error: error.message });
  }
};

module.exports = { testAi, buildSuggestion };