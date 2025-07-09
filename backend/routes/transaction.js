const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/transaction');
const { authenticateToken } = require('./userAuth');


router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { paymentAmount, paymentMethod, subscriptionPlan, transactionStatus, validTill } = req.body;

    const transaction = new Transaction({
      transactionId: uuidv4(),
      paymentAmount,
      paymentMethod,
      transactionStatus,
      userId: req.user._id,
      subscriptionPlan,
      validTill,
    });

    await transaction.save();
    res.status(201).json({ message: 'Subscription transaction created successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});


router.get('/my-transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
});

module.exports = router;
