import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import csvParser from "csv-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Ensures the app exits if DB fails
  });

const app = express();
app.use(cors());
app.use(express.json());
// Configure Multer for Excel file uploads
const upload = multer({ dest: "uploads/" });

/*
  IMPORTANT: The ordering of routes is critical.
  Here, we define the search route with a distinct path (/products/find)
  before any parameterized routes (like /products/:barcode).
*/

// 1. Find Products by Barcode
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
app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  const requiredFields = [
    "barcode",
    "name",
    "quantity",
    "warehouse",
    "containerCode",
  ];
  const products = [];
  const seenBarcodes = new Set(); // Track duplicates

  try {
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        // 🔥 Convert quantity to a valid number by removing commas FIRST
        // Ensure quantity is treated as a proper number
        const rawQuantity =
          row.quantity?.toString().replace(/,/g, "").trim() || "0";
        const quantityValue = parseFloat(rawQuantity);

        // 🔴 ERROR: Missing critical fields (Barcode, Name, Quantity)
        if (!row.barcode) {
          console.error(
            `❌ Error: Missing barcode in row: ${JSON.stringify(row)}`
          );
          return;
        }
        if (!row.name) {
          console.error(
            `❌ Error: Missing product name in row: ${JSON.stringify(row)}`
          );
          return;
        }
        if (isNaN(quantityValue) || quantityValue <= 0) {
          console.error(
            `❌ Error: Invalid quantity '${quantityValue}' in row: ${JSON.stringify(
              row
            )}`
          );
          return;
        }

        // 🔴 ERROR: Duplicate Barcode
        if (seenBarcodes.has(row.barcode.toLowerCase().trim())) {
          console.error(
            `⚠️ Warning: Duplicate barcode '${
              row.barcode
            }' found, skipping row: ${JSON.stringify(row)}`
          );
          return;
        }
        seenBarcodes.add(row.barcode.toLowerCase().trim());

        // 🔴 ERROR: Missing Warehouse or Container Code
        if (!row.warehouse) {
          console.warn(
            `⚠️ Warning: Missing warehouse info, defaulting to 'Unknown' for barcode: ${row.barcode}`
          );
        }
        console.warn(
          `❌ Skipping row due to validation failure: ${JSON.stringify(row)}`
        );

        if (!row.containerCode) {
          console.warn(
            `⚠️ Warning: Missing containerCode, defaulting to 'Unassigned' for barcode: ${row.barcode}`
          );
        }

        // ✅ Build Product Object (with fallback values)
        const productData = {
          barcode: row.barcode.toLowerCase().trim(),
          name: row.name.trim(),
          quantity: quantityValue,
          warehouse: row.warehouse ? row.warehouse.trim() : "Unknown Warehouse",
          containerCode: row.containerCode
            ? row.containerCode.trim()
            : "Unassigned",
        };

        products.push(productData);
      })
      .on("end", async () => {
        console.log(`✅ Total valid rows processed: ${products.length}`);
        if (products.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid rows found in the CSV!" });
        }

        try {
          await Product.insertMany(products);
          fs.unlinkSync(req.file.path); // Cleanup uploaded file
          res.json({
            message: "CSV data successfully uploaded!",
            inserted: products.length,
          });
        } catch (dbError) {
          console.error("❌ Database insertion error:", dbError);
          res.status(500).json({ message: "Database insertion error!" });
        }
      });
  } catch (err) {
    console.error("❌ CSV Processing Error:", err);
    res.status(500).json({ message: "Error processing CSV file!" });
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
    if (!product) return res.status(404).json({ message: "Product not found" });
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
    return res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ message: "Error deleting product" });
  }
});
// delete all products
app.delete("/products", async (req, res) => {
  try {
    await Product.deleteMany({});
    console.log("✅ All products deleted successfully.");
    res.status(200).json({ message: "All products deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting products:", error);
    res.status(500).json({ error: "Error deleting products." });
  }
});
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

// Start the Server
const PORT = process.env.PORT || 5004;
const BASE_URL = process.env.BASE_URL; // Use the backend URL if needed

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${BASE_URL || `http://localhost:${PORT}`}`);
});
