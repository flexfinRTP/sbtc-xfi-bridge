import { makeContractDeploy, broadcastTransaction, AnchorMode, getAddressFromPrivateKey, PostConditionMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to serialize BigInt
function replacer(key, value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

async function deployStacksContracts() {
  try {
    console.log('Starting Stacks testnet deployment...');

    const network = new StacksTestnet();
    const mnemonic = process.env.STACKS_MNEMONIC;
    
    if (!mnemonic) {
      throw new Error('STACKS_MNEMONIC environment variable not set');
    }

    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: 'password',
    });

    const privateKey = wallet.accounts[0].stxPrivateKey;

    const contracts = [
      { name: 'mock-xfi-token', path: './contracts/stacks/mock-xfi-token.clar' },
      { name: 'mock-sbtc-token', path: './contracts/stacks/mock-sbtc-token.clar' },
      { name: 'mock-stx-token', path: './contracts/stacks/mock-stx-token.clar' },
      { name: 'sbtc-bridge', path: './contracts/stacks/sbtc-bridge.clar' }
    ];

    for (const contract of contracts) {
      await deployContract(contract.name, contract.path, network, privateKey);
    }

    console.log('Stacks testnet deployment completed');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

async function deployContract(contractName, contractPath, network, privateKey) {
  try {
    const codeBody = fs.readFileSync(contractPath, 'utf8').toString();
    
    console.log(`Deploying ${contractName}...`);
    console.log(`Contract code length: ${codeBody.length}`);

    const transaction = await makeContractDeploy({
      codeBody,
      contractName,
      senderKey: privateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 100000, // Set a fixed fee to avoid estimation issues
    });

    console.log(`Broadcasting ${contractName} deployment transaction...`);
    console.log('Transaction:', JSON.stringify(transaction, replacer, 2));

    try {
      const result = await broadcastTransaction(transaction, network);
      console.log(`${contractName} deployment result:`, JSON.stringify(result, replacer, 2));

      if (result.error) {
        throw new Error(`Failed to deploy ${contractName}: ${result.error}`);
      }

      console.log(`${contractName} deployed successfully`);
      console.log(`Contract address: ${getAddressFromPrivateKey(privateKey)}.${contractName}`);
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError);
      if (broadcastError.response) {
        console.error('Response status:', broadcastError.response.status);
        console.error('Response data:', broadcastError.response.data);
      }
      throw broadcastError;
    }
  } catch (error) {
    console.error(`Error deploying ${contractName}:`, error);
    throw error;
  }
}

deployStacksContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });