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