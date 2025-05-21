import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
 // barcode: { type: String, required: true, unique: true },
 barcode: { type: String, required: true, unique: true, lowercase: true, trim: true },

  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  warehouse: { type: String, required: true },
  containerCode: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
