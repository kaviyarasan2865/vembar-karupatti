import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive: { type: Boolean, default: true },
  units: [
    {
      unit: { type: String, required: true },
      quantity: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
    },
  ],
  image: { type: String, required: true }, // For Base64 image
  image2: { type: String },
  image3: { type: String },
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
