import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product'
  },
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  unitIndex: {
    type: Number,
    required: [true, 'Unit index is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0
  }
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
CartSchema.index({ userId: 1 });

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;