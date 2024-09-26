const { StacksTestnet } = require('@stacks/network');
const { makeSTXTokenTransfer, AnchorMode } = require('@stacks/transactions');
const { contracts } = require('../config/contracts');

const network = new StacksTestnet();

const callStacksContract = async (functionName, functionArgs) => {
  // This function remains the same as it's a read-only operation
  const result = await callReadOnlyFunction({
    contractAddress: contracts.stacks.contractAddress,
    contractName: contracts.stacks.contractName,
    functionName,
    functionArgs,
    network,
  });
  return result;
};

const initiateStacksTransfer = async (amount, recipient) => {
  const txOptions = {
    recipient,
    amount,
    senderKey: 'unused',
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeSTXTokenTransfer(txOptions);
  
  // Instead of broadcasting, return the unsigned transaction
  return transaction;
};

module.exports = {
  callStacksContract,
  initiateStacksTransfer,
};