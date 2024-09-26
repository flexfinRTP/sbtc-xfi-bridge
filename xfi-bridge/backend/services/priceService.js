const axios = require('axios');
const { callStacksContract } = require('./stacksService');
const { contracts } = require('../config/contracts');

const fetchPrices = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,crossfi&vs_currencies=usd');
    const sbtcPrice = Math.floor(response.data.bitcoin.usd * 1e8); // Convert to satoshis
    const xfiPrice = Math.floor(response.data.crossfi.usd * 1e8); // Assuming 8 decimal places for XFI
    return { sbtcPrice, xfiPrice };
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};

const updatePrices = async () => {
  try {
    const { sbtcPrice, xfiPrice } = await fetchPrices();
    
    // Update prices in Stacks contract
    await callStacksContract('update-prices', [sbtcPrice, xfiPrice]);
    
    // Update prices in CrossFi contract
    const web3 = new Web3(process.env.CROSSFI_RPC_URL);
    const contract = new web3.eth.Contract(contracts.crossfi.abi, contracts.crossfi.contractAddress);
    await contract.methods.updatePrices(sbtcPrice, xfiPrice).send({ from: process.env.CROSSFI_ADMIN_ADDRESS });

    console.log('Prices updated successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
    throw error;
  }
};

module.exports = {
  fetchPrices,
  updatePrices,
};