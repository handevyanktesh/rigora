const Product = require("../models/Product");
const { generateContent } = require("./geminiService");
const {
  checkCpuMotherboard,
  checkRamMotherboard,
  checkPsuWattage,
} = require("./compatibilityService");

// ...fetchCatalogOptions and buildPrompt stay unchanged from Breakdown 2...

const getAiBuildSuggestion = async (budget, useCase) => {
  const catalogByCategory = await fetchCatalogOptions(budget);
  const prompt = buildPrompt(budget, useCase, catalogByCategory);

  const rawResponse = await generateContent(prompt);
  const cleaned = rawResponse.replace(/```json|```/g, "").trim();

  let picks;
  try {
    picks = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("AI response was not valid JSON: " + rawResponse);
  }

  // Fetch full product documents for whatever the AI picked
  const productIds = Object.values(picks);
  const products = await Product.find({ _id: { $in: productIds } });

  // Build a lookup so we can find each picked product by category
  const findByCategory = (category) =>
    products.find((p) => p.category === category);

  const cpu = findByCategory("CPU");
  const motherboard = findByCategory("Motherboard");
  const ram = findByCategory("RAM");
  const gpu = findByCategory("GPU");
  const psu = findByCategory("PSU");

  // Run the SAME service functions built in Phase 4 — direct function calls, no HTTP round-trip
  const compatibilityResults = [];

  if (cpu && motherboard) {
    compatibilityResults.push({
      check: "CPU + Motherboard",
      ...checkCpuMotherboard(cpu, motherboard),
    });
  }

  if (ram && motherboard) {
    compatibilityResults.push({
      check: "RAM + Motherboard",
      ...checkRamMotherboard(ram, motherboard),
    });
  }

  if (cpu && gpu && psu) {
    compatibilityResults.push({
      check: "PSU Wattage",
      ...checkPsuWattage(cpu, gpu, psu),
    });
  }

  const overallCompatible = compatibilityResults.every((r) => r.compatible);

  return {
    picks,
    products,
    compatibilityResults,
    overallCompatible,
  };
};

module.exports = { getAiBuildSuggestion };