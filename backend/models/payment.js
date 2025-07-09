const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentMethod: { type: String, required: true }, 
  transactionId: { type: String, required: true }, 
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'success', 'failed'] 
  },
  amount: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  subscriptionPlan: { 
    type: String, 
    required: true, 
    enum: ['1-month', '3-months', '1-year'] 
  },
  validTill: { type: Date, required: false }, 
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
