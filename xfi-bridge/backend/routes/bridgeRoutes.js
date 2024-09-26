const express = require('express');
const bridgeController = require('../controllers/bridgeController');

const router = express.Router();

router.post('/initiate-transfer', bridgeController.initiateTransfer);
router.get('/transaction/:txId', bridgeController.getTransactionStatus);
router.post('/confirm-stacks-transfer', bridgeController.confirmStacksTransfer);

module.exports = router;