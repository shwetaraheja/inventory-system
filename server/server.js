import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/*
  IMPORTANT: The ordering of routes is critical.
  Here, we define the search route with a distinct path (/products/find)
  before any parameterized routes (like /products/:barcode).
*/

// 1. Find Products by Barcode
// Use /products/find?barcode=dcad to search
app.get("/products/find", async (req, res) => {
  console.log("✅ Find route hit!");
  const { barcode } = req.query;
  console.log("Searching for:", barcode);
  try {
    const products = await Product.find({
      barcode: { $regex: barcode || "", $options: "i" },
    }).limit(5);
    return res.json(products); // Returns an array (even an empty one)
  } catch (err) {
    console.error("Find error:", err);
    return res.status(500).json({ message: "Error searching product" });
  }
});

// 2. Add Product
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.json(newProduct);
  } catch (err) {
    return res.status(500).json({
      message: "Error adding product",
      error: err.message,
    });
  }
});

// 3. Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching products" });
  }
});

// 4. Get Product by Barcode
app.get("/products/:barcode", async (req, res) => {
  const { barcode } = req.params;
  try {
    const product = await Product.findOne({ barcode: barcode.toLowerCase() });
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// 5. Update Product
app.put("/products/:barcode", async (req, res) => {
  try {
    const { barcode } = req.params;
    const updatedData = { ...req.body };
    // Prevent updating the barcode field
    delete updatedData.barcode;

    const updatedProduct = await Product.findOneAndUpdate(
      { barcode: { $regex: `^${barcode}$`, $options: "i" } },
      updatedData,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    return res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ message: "Error updating product" });
  }
});
app.delete("/products/:barcode", async (req, res) => {
  const barcode = req.params.barcode.toLowerCase();
  try {
    const deletedProduct = await Product.findOneAndDelete({ barcode });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ message: "Error deleting product" });
  }
});
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

// Start the Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
