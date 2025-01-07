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

const orderAddressSchema = new mongoose.Schema({
  firstName: {
    type:String},
    lastName: {
    type:String},
    phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^\+[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number.`
    }
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Please provide a valid address']
    },
    city:{
      type: String,
      trim: true,
      required: [true, 'Please provide a valid city']
    },
    state: {
      type: String,
      trim: true,
      required: [true, 'Please provide a valid state'],
      default:"TN"
    },
    zipCode: {
      type: String,
      trim: true,
      required: [true, 'Please provide a valid zip code'],
      validate: {
        validator: function(v: string) {
          return /^\d{5}(?:[-\s]\d{4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid zip code.`
      }
    }
});
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
    type: [orderAddressSchema],
    required: true,
    validate: {
      validator: (obj: any) => {
        return obj.firstName && obj.lastName && obj.phone && obj.address && obj.city && obj.state && obj.zipCode;
      },
      message: "Shipping address is required"
    }
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