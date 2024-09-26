import { openSTXTransfer } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode } from '@stacks/transactions';

const STACKS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS;
const STACKS_CONTRACT_NAME = process.env.NEXT_PUBLIC_STACKS_CONTRACT_NAME;
const XFI_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_XFI_CONTRACT_ADDRESS;

export const initiateStacksTransfer = async (amount, recipient) => {
  const functionArgs = [amount, recipient];

  const txOptions = {
    contractAddress: STACKS_CONTRACT_ADDRESS,
    contractName: STACKS_CONTRACT_NAME,
    functionName: 'initiate-crosschain-transfer',
    functionArgs,
    network: new StacksTestnet(),
    anchorMode: AnchorMode.Any,
    onFinish: (data) => {
      console.log('Stacks transaction:', data);
    },
  };

  await openSTXTransfer(txOptions);
};

export const initiateXfiTransfer = async (amount, recipient) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called in a browser environment');
  }

  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const ethers = await import('ethers');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    XFI_CONTRACT_ADDRESS,
    ['function initiateCrossChainTransfer(uint256 amount, bytes32 stacksRecipient)'],
    signer
  );

  const tx = await contract.initiateCrossChainTransfer(amount, ethers.utils.formatBytes32String(recipient));
  await tx.wait();

  console.log('XFI transaction:', tx.hash);
  return tx.hash;
};