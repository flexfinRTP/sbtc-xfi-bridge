import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, standardPrincipalCV, uintCV, deserializeTransaction } from '@stacks/transactions';
import { ethers } from 'ethers';

const STACKS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS;
const STACKS_CONTRACT_NAME = process.env.NEXT_PUBLIC_STACKS_CONTRACT_NAME;
const XFI_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_XFI_CONTRACT_ADDRESS;
const XFI_RPC_URL = process.env.NEXT_PUBLIC_XFI_RPC_URL;

export const initiateStacksTransfer = async (amount, recipient) => {
  try {
    // Get the unsigned transaction from your backend
    const response = await fetch('/api/bridge/initiate-transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromChain: 'stacks',
        toChain: 'crossfi',
        amount,
        toAddress: recipient,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate transfer on backend');
    }

    const { unsignedTx } = await response.json();

    // Deserialize the transaction
    const transaction = deserializeTransaction(unsignedTx);

    // Use Leather wallet to sign and broadcast the transaction
    await openContractCall({
      ...transaction,
      network: new StacksTestnet(),
      onFinish: (data) => {
        console.log('Transaction finished:', data);
        confirmTransactionOnBackend(data.txId);
      },
      onCancel: () => {
        console.log('Transaction was canceled');
      },
    });
  } catch (error) {
    console.error('Error initiating Stacks transfer:', error);
    throw error;
  }
};

const confirmTransactionOnBackend = async (txId) => {
  try {
    const response = await fetch('/api/bridge/confirm-stacks-transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txId }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm transaction on backend');
    }

    const result = await response.json();
    console.log('Transaction confirmed on backend:', result);
  } catch (error) {
    console.error('Error confirming transaction on backend:', error);
  }
};

export const initiateXfiTransfer = async (amount, recipient) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in a browser environment');
  }

  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      XFI_CONTRACT_ADDRESS,
      ['function initiateCrossChainTransfer(uint256 amount, bytes32 stacksRecipient)'],
      signer
    );

    const tx = await contract.initiateCrossChainTransfer(
      ethers.utils.parseUnits(amount, 18),
      ethers.utils.formatBytes32String(recipient)
    );
    
    const receipt = await tx.wait();
    console.log('XFI transaction:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error initiating XFI transfer:', error);
    throw error;
  }
};