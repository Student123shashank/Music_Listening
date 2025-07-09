const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true }, 
  paymentAmount: { type: Number, required: true },
  transactionStatus: {
    type: String,
    required: true,
    enum: ['pending', 'success', 'failed']
  },
  paymentMethod: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'user' },
  subscriptionPlan: { type: String, enum: ['1-month', '3-months', '1-year'], required: true },
  validTill: { type: Date }, 
}, { timestamps: true });

module.exports = mongoose.model('transaction', transactionSchema);
