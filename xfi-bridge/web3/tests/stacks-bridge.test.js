import { assert } from 'chai';
import { mocknet } from '@stacks/network';
import { callReadOnlyFunction, makeContractCall, broadcastTransaction, uintCV, bufferCV, standardPrincipalCV } from '@stacks/transactions';

describe('sBTC Bridge Contract Tests', () => {
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const contractName = 'sbtc-bridge';
  const network = new mocknet();
  const senderAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const senderKey = 'your-private-key';

  const xfiTokenContract = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.xfi-token';
  const sbtcTokenContract = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token';
  const stxTokenContract = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-token';

  it('should deposit XFI', async () => {
    const functionName = 'deposit';
    const amount = 1000000; // 1 XFI

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [standardPrincipalCV(xfiTokenContract), uintCV(amount)],
      senderKey,
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should deposit sBTC', async () => {
    const functionName = 'deposit';
    const amount = 100000000; // 1 sBTC

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [standardPrincipalCV(sbtcTokenContract), uintCV(amount)],
      senderKey,
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should deposit STX', async () => {
    const functionName = 'deposit';
    const amount = 1000000; // 1 STX

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [standardPrincipalCV(stxTokenContract), uintCV(amount)],
      senderKey,
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should get correct balance for XFI', async () => {
    const functionName = 'get-balance';

    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [standardPrincipalCV(senderAddress), standardPrincipalCV(xfiTokenContract)],
      network,
    });

    assert.equal(result, 1000000);
  });

  it('should initiate cross-chain transfer for XFI', async () => {
    const functionName = 'initiate-crosschain-transfer';
    const amount = 500000; // 0.5 XFI
    const recipient = Buffer.from('0x1234567890123456789012345678901234567890', 'hex');

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [standardPrincipalCV(xfiTokenContract), uintCV(amount), bufferCV(recipient)],
      senderKey,
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should confirm cross-chain transfer', async () => {
    const functionName = 'confirm-crosschain-transfer';
    const txId = Buffer.from('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [bufferCV(txId)],
      senderKey,
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should update prices', async () => {
    const functionName = 'update-prices';
    const newSbtcPrice = 3000000000; // $30,000
    const newXfiPrice = 100000000;   // $1
    const newStxPrice = 50000000;    // $0.50

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [uintCV(newSbtcPrice), uintCV(newXfiPrice), uintCV(newStxPrice)],
      senderKey,
      network,
    });

    const result = await broadcastTransaction(transaction, network);
    assert.equal(result.success, true);
  });

  it('should fail to withdraw with insufficient balance', async () => {
    const functionName = 'withdraw';
    const amount = 2000000; // 2 XFI (more than deposited)

    const transaction = await makeContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs: [standardPrincipalCV(xfiTokenContract), uintCV(amount)],
      senderKey,
      network,
    });

    try {
      await broadcastTransaction(transaction, network);
      assert.fail('Expected transaction to fail');
    } catch (error) {
      assert.include(error.message, 'ERR_NOT_ENOUGH_BALANCE');
    }
  });
});