const mongoose = require("mongoose");
const User = require("./user");

const subscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  // Changed to match the exported model name
    required: [true, "User reference is required"],
    validate: {
      validator: async function(userId) {
        const user = await User.findById(userId);
        return user !== null;
      },
      message: "User does not exist"
    }
  },
  planType: { 
    type: String, 
    enum: {
      values: ["monthly", "quarterly", "yearly"],
      message: "Plan type must be monthly, quarterly, or yearly"
    },
    required: [true, "Plan type is required"]
  },
  amount: { 
    type: Number, 
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"]
  },
  startDate: { 
    type: Date, 
    default: Date.now,
    immutable: true  // Cannot be modified after creation
  },
  endDate: { 
    type: Date, 
    required: [true, "End date is required"],
    validate: {
      validator: function(endDate) {
        return endDate > this.startDate;
      },
      message: "End date must be after start date"
    }
  },
  status: { 
    type: String, 
    enum: {
      values: ["active", "expired", "cancelled"],
      message: "Status must be active, expired, or cancelled"
    },
    default: "active"
  },
  cancelledAt: {
    type: Date,
    validate: {
      validator: function(cancelledAt) {
        // Only required if status is cancelled
        if (this.status === "cancelled") {
          return cancelledAt !== undefined;
        }
        return true;
      },
      message: "Cancellation date is required when status is cancelled"
    }
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true  // Allows null values but enforces uniqueness for non-null values
  }
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },  // Includes virtuals when converted to JSON
  toObject: { virtuals: true }  // Includes virtuals when converted to objects
});

// Virtual property for days remaining
subscriptionSchema.virtual("daysRemaining").get(function() {
  if (this.status !== "active") return 0;
  const now = new Date();
  const diff = this.endDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Indexes for better query performance
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ user: 1, status: 1 });

// Pre-save hook to validate subscription dates
subscriptionSchema.pre("save", function(next) {
  if (this.isModified("status") && this.status === "cancelled") {
    this.cancelledAt = new Date();
  }
  next();
});

// Static method to find active subscriptions
subscriptionSchema.statics.findActiveByUser = async function(userId) {
  return this.findOne({ 
    user: userId, 
    status: "active",
    endDate: { $gt: new Date() }
  });
};

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === "active" && this.endDate > new Date();
};

// Query helper for active subscriptions
subscriptionSchema.query.active = function() {
  return this.where({ 
    status: "active",
    endDate: { $gt: new Date() }
  });
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;