import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: {
      validator: (array: any[]) => array.length > 0,
      message: "Order must contain at least one product"
    }
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total cannot be negative"]
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  shippingAddress: {
    type: String,
    required: true
  },
  trackingNumber: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for common queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;