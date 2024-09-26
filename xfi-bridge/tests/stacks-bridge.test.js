const { assert } = require('chai');
const { mocknet } = require('@stacks/network');
const { callReadOnlyFunction, broadcastTransaction, makeContractCall } = require('@stacks/transactions');

describe('sBTC Bridge Contract Tests', () => {
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const contractName = 'sbtc-bridge';
  const network = new mocknet();

  it('should deposit sBTC', async () => {
    const functionName = 'deposit';
    const functionArgs = [1000000]; // 0.01 sBTC

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderKey: 'your-private-key',
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should get correct balance', async () => {
    const functionName = 'get-balance';
    const functionArgs = ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'];

    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network,
    });

    assert.equal(result, 1000000);
  });

  // Add more tests for other functions
});