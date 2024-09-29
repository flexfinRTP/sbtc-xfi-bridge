const {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  bufferCV,
  principalCV,
  contractPrincipalCV,
} = require("@stacks/transactions");
const { StacksMainnet, StacksTestnet } = require("@stacks/network");
const { contracts } = require("../config/contracts");

const network =
  process.env.STACKS_NETWORK === "mainnet"
    ? new StacksMainnet()
    : new StacksTestnet();

const callStacksContract = async (functionName, functionArgs) => {
  const contractAddress = contracts.stacks.contractAddress;
  const contractName = contracts.stacks.contractName;

  const txOptions = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    senderKey: process.env.STACKS_PRIVATE_KEY,
    validateWithAbi: true,
    network,
    anchorMode: 1,
  };

  const transaction = await makeContractCall(txOptions);
  return broadcastTransaction(transaction, network);
};

const initiateStacksTransfer = async (amount, recipient, currency) => {
  const functionName = "initiate-crosschain-transfer";
  const tokenContract = contracts.stacks[`${currency}TokenAddress`];

  const functionArgs = [
    contractPrincipalCV(tokenContract.split('.')[0], tokenContract.split('.')[1]),
    uintCV(amount),
    bufferCV(Buffer.from(recipient.slice(2), 'hex')),
  ];

  return callStacksContract(functionName, functionArgs);
};

const confirmCrossChainTransfer = async (txId) => {
  const functionName = "confirm-crosschain-transfer";
  const functionArgs = [bufferCV(Buffer.from(txId.slice(2), 'hex'))];

  return callStacksContract(functionName, functionArgs);
};

module.exports = {
  callStacksContract,
  initiateStacksTransfer,
  confirmCrossChainTransfer,
};