const Web3 = require('web3');
const { contracts } = require('../config/contracts');

const web3 = new Web3(process.env.CROSSFI_RPC_URL);
const contract = new web3.eth.Contract(contracts.crossfi.abi, contracts.crossfi.contractAddress);

const initiateCrossfiTransfer = async (amount, stacksRecipient, fromAddress, currency) => {
  const gasPrice = await web3.eth.getGasPrice();
  
  const tokenAddress = contracts.crossfi[`${currency}TokenAddress`];

  const gasEstimate = await contract.methods.initiateCrossChainTransfer(tokenAddress, amount, stacksRecipient).estimateGas({ from: fromAddress });

  const tx = {
    from: fromAddress,
    to: contracts.crossfi.contractAddress,
    gas: gasEstimate,
    gasPrice: gasPrice,
    data: contract.methods.initiateCrossChainTransfer(tokenAddress, amount, stacksRecipient).encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.CROSSFI_PRIVATE_KEY);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

const confirmCrossChainTransfer = async (stacksTxId) => {
  const gasPrice = await web3.eth.getGasPrice();
  
  const gasEstimate = await contract.methods.confirmCrossChainTransfer(stacksTxId).estimateGas({ from: process.env.CROSSFI_ADMIN_ADDRESS });

  const tx = {
    from: process.env.CROSSFI_ADMIN_ADDRESS,
    to: contracts.crossfi.contractAddress,
    gas: gasEstimate,
    gasPrice: gasPrice,
    data: contract.methods.confirmCrossChainTransfer(stacksTxId).encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.CROSSFI_PRIVATE_KEY);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

module.exports = {
  initiateCrossfiTransfer,
  confirmCrossChainTransfer,
};