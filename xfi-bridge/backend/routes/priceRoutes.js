const express = require('express');
const priceController = require('../controllers/priceController');

const router = express.Router();

router.get('/prices', priceController.getPrices);
router.post('/update-prices', priceController.updatePrices);

module.exports = router;