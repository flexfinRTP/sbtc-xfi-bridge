const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txId: {
    type: String,
    required: true,
    unique: true,
  },
  fromChain: {
    type: String,
    enum: ['stacks', 'crossfi'],
    required: true,
  },
  toChain: {
    type: String,
    enum: ['stacks', 'crossfi'],
    required: true,
  },
  fromAddress: {
    type: String,
    required: true,
  },
  toAddress: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);