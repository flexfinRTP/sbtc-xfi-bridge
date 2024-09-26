const {
  makeSTXTokenTransfer,
  AnchorMode,
  createAssetInfo,
  FungibleConditionCode,
  makeContractCall,
  broadcastTransaction,
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
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  return transaction;
};

const createUnsignedStacksTransaction = async (functionName, functionArgs) => {
  const contractAddress = contracts.stacks.contractAddress;
  const contractName = contracts.stacks.contractName;

  const txOptions = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  return transaction;
};

const initiateStacksTransfer = async (amount, recipient) => {
  const functionName = "initiate-crosschain-transfer";
  const functionArgs = [
    uintCV(amount),
    standardPrincipalCV(recipient)
  ];

  const transaction = await createUnsignedStacksTransaction(functionName, functionArgs);
  return transaction;
};

const transferSTX = async (recipient, amount) => {
  const transaction = await makeSTXTokenTransfer({
    recipient,
    amount,
    senderKey: process.env.STACKS_PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.Any,
  });

  const broadcastResponse = await broadcastTransaction(transaction, network);
  return broadcastResponse;
};

module.exports = {
  callStacksContract,
  initiateStacksTransfer,
  transferSTX,
};
