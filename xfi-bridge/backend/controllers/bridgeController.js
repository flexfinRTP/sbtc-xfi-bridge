const Transaction = require('../models/Transaction');
const { initiateStacksTransfer } = require('../services/stacksService');
const { initiateCrossfiTransfer } = require('../services/crossfiService');

exports.initiateTransfer = async (req, res) => {
  try {
    const { fromChain, toChain, amount, fromAddress, toAddress, currency } = req.body;

    let txId, unsignedTx;
    if (fromChain === 'stacks') {
      unsignedTx = await initiateStacksTransfer(amount, toAddress, currency);
      // Return the unsigned transaction to the frontend
      return res.status(200).json({ unsignedTx: unsignedTx.serialize().toString('hex') });
    } else if (fromChain === 'crossfi') {
      const result = await initiateCrossfiTransfer(amount, toAddress, fromAddress, currency);
      txId = result.transactionHash;
    } else {
      return res.status(400).json({ error: 'Invalid fromChain' });
    }

    const transaction = new Transaction({
      txId,
      fromChain,
      toChain,
      fromAddress,
      toAddress,
      amount,
      status: 'pending'
    });

    await transaction.save();

    res.status(201).json({ message: 'Transfer initiated', txId });
  } catch (error) {
    console.error('Error initiating transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTransactionStatus = async (req, res) => {
  try {
    const { txId } = req.params;
    const transaction = await Transaction.findOne({ txId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ status: transaction.status });
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.confirmStacksTransfer = async (req, res) => {
  try {
    const { txId } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { txId },
      { status: 'completed' },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction confirmed', transaction });
  } catch (error) {
    console.error('Error confirming Stacks transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};