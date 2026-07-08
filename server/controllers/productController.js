const Product = require("../models/Product");

// @route  GET /api/products
// Public - list all products (with optional category filter)
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;
 
    // Build filter object dynamically
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // case-insensitive partial match
    }

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination math
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Run both queries: the page of results, and the total count for that filter
    const [products, totalCount] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/products/:id
// Public - get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
// @route  POST /api/products
// Admin only - create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};

// @route  PUT /api/products/:id
// Admin only - update product
const updateProduct = async (req, res) => {
  try {
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // return the UPDATED document, not the old one
      runValidators: true, // re-run schema validation (e.g. enum, min) on update
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid update data", error: error.message });
  }
};

// @route  DELETE /api/products/:id
// Admin only - delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};