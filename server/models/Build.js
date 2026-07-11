const mongoose = require("mongoose");

const buildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    components: {
      cpu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      motherboard: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      ram: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      gpu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      psu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      storage: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      case: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      cooler: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Build", buildSchema);