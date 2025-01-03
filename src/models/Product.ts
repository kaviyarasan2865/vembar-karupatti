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

// Add indexes for frequently queried fields
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'units.price': 1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
