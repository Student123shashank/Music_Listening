const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/payment');
const { authenticateToken } = require('./userAuth');
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: uuidv4(),
    };
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
});


router.post('/capture-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentId, amount, subscriptionPlan, paymentMethod } = req.body;

    await razorpayInstance.payments.capture(paymentId, amount * 100, 'INR');

    const validTill = getValidity(subscriptionPlan); 

    const payment = new Payment({
      transactionId: paymentId,
      paymentMethod,
      paymentStatus: 'success',
      amount,
      userId: req.user._id,
      subscriptionPlan,
      validTill,
    });

    await payment.save();

    res.json({ message: 'Payment captured successfully', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error capturing payment' });
  }
});


function getValidity(plan) {
  const now = new Date();
  switch (plan) {
    case '1-month':
      return new Date(now.setMonth(now.getMonth() + 1));
    case '3-months':
      return new Date(now.setMonth(now.getMonth() + 3));
    case '1-year':
      return new Date(now.setFullYear(now.getFullYear() + 1));
    default:
      return now;
  }
}

module.exports = router;
