const { fetchPrices, updatePrices } = require('../services/priceService');

exports.getPrices = async (req, res) => {
  try {
    const prices = await fetchPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePrices = async (req, res) => {
  try {
    await updatePrices();
    res.json({ message: 'Prices updated successfully' });
  } catch (error) {
    console.error('Error updating prices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};