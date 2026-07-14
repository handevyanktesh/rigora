const { generateContent } = require("../services/geminiService");
const { getAiBuildSuggestion } = require("../services/aiBuilderService");

const testAi = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const response = await generateContent(prompt);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: "AI service error", error: error.message });
  }
};

const buildSuggestion = async (req, res) => {
  try {
    const { budget, useCase } = req.body;

    if (!budget || !useCase) {
      return res.status(400).json({ message: "budget and useCase are required" });
    }

    const result = await getAiBuildSuggestion(budget, useCase);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "AI build suggestion failed", error: error.message });
  }
};

module.exports = { testAi, buildSuggestion };