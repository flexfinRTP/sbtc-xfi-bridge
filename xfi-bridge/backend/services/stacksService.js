const { 
    makeSTXTokenTransfer, 
    AnchorMode,
    createAssetInfo,
    FungibleConditionCode,
    makeContractCall,
    broadcastTransaction
  } = require('@stacks/transactions');
  const { StacksMainnet, StacksTestnet } = require('@stacks/network');
  const { contracts } = require('../config/contracts');
  
  const network = process.env.STACKS_NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  
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
    const broadcastResponse = await broadcastTransaction(transaction, network);
    return broadcastResponse;
  };
  
  const initiateStacksTransfer = async (amount, recipient) => {
    const contractAddress = contracts.stacks.contractAddress;
    const contractName = contracts.stacks.contractName;
    const functionName = 'initiate-crosschain-transfer';
    const sbtcTokenAddress = await callStacksContract('get-sbtc-token', []);
  
    const postConditions = [
      makeStandardSTXPostCondition(
        contractAddress,
        FungibleConditionCode.LessEqual,
        amount
      ),
    ];
  
    const txOptions = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: [
        createAssetInfo(sbtcTokenAddress.split('.')[0], sbtcTokenAddress.split('.')[1], 'sbtc'),
        amount,
        recipient
      ],
      senderKey: process.env.STACKS_PRIVATE_KEY,
      validateWithAbi: true,
      network,
      anchorMode: AnchorMode.Any,
      postConditions,
    };
  
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    return broadcastResponse;
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