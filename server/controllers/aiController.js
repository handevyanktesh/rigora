const { generateContent } = require("../services/geminiService");

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

module.exports = { testAi };