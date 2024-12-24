import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    maxlength: [1000, "Description cannot be more than 1000 characters"]
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    validate: {
      validator: (value: number) => value >= 0,
      message: "Price must be a positive number"
    }
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be a whole number"
    }
  },
  quantityType: {
    type: String,
    required: [true, "Quantity type is required"],
    enum: ["pieces", "kg", "grams", "liters", "units"],
    trim: true
  },
  image: {
    type: String,
    required: [true, "Main product image is required"],
    validate: {
      validator: (value: string) => /^https?:\/\/.+/.test(value),
      message: "Please provide a valid image URL"
    }
  },
  image2: {
    type: String,
    validate: {
      validator: (value: string) => !value || /^https?:\/\/.+/.test(value),
      message: "Please provide a valid image URL"
    }
  },
  image3: {
    type: String,
    validate: {
      validator: (value: string) => !value || /^https?:\/\/.+/.test(value),
      message: "Please provide a valid image URL"
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for common queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;