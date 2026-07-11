const Product = require("../models/Product");
const { generateContent } = require("./geminiService");

const CATEGORIES = ["CPU", "Motherboard", "RAM", "GPU", "PSU", "Storage", "Case", "Cooler"];

// Fetch a reasonable set of affordable options per category
const fetchCatalogOptions = async (budget) => {
  // Rough per-category ceiling: no single part should eat the whole budget
  const categoryCeiling = budget * 0.5;

  const catalogByCategory = {};

  for (const category of CATEGORIES) {
    const products = await Product.find({
      category,
      price: { $lte: categoryCeiling },
      stock: { $gt: 0 }, // only in-stock items
    })
      .limit(5) // keep prompt size manageable
      .select("_id name brand price specs");

    catalogByCategory[category] = products;
  }

  return catalogByCategory;
};

// Build the actual prompt text sent to Gemini
const buildPrompt = (budget, useCase, catalogByCategory) => {
  let prompt = `You are a PC building assistant. A user wants a PC build for: "${useCase}" with a total budget of ₹${budget}.\n\n`;
  prompt += `You may ONLY choose from the following available products, listed by category. Each product has an "id" you must use to refer to it.\n\n`;

  for (const category of CATEGORIES) {
    prompt += `${category} options:\n`;
    catalogByCategory[category].forEach((p) => {
      const specsText = JSON.stringify(Object.fromEntries(p.specs || []));
      prompt += `- id: ${p._id}, name: ${p.name}, price: ₹${p.price}, specs: ${specsText}\n`;
    });
    prompt += `\n`;
  }

  prompt += `Choose ONE product id per category that best fits the budget and use case. `;
  prompt += `Respond ONLY with valid JSON in this exact format, no other text:\n`;
  prompt += `{"cpu": "id", "motherboard": "id", "ram": "id", "gpu": "id", "psu": "id", "storage": "id", "case": "id", "cooler": "id"}`;

  return prompt;
};

const getAiBuildSuggestion = async (budget, useCase) => {
  const catalogByCategory = await fetchCatalogOptions(budget);
  const prompt = buildPrompt(budget, useCase, catalogByCategory);

  const rawResponse = await generateContent(prompt);

  // Gemini sometimes wraps JSON in markdown code fences — strip those if present
  const cleaned = rawResponse.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("AI response was not valid JSON: " + rawResponse);
  }

  return parsed;
};

module.exports = { getAiBuildSuggestion };