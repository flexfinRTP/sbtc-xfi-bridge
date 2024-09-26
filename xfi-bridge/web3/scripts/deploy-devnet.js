import { makeContractDeploy, broadcastTransaction, AnchorMode, getAddressFromPrivateKey } from '@stacks/transactions';
import { StacksDevnet } from '@stacks/network';
import fs from 'fs';

async function deployStacksContracts() {
  console.log('Starting Stacks devnet deployment...');

  const network = new StacksDevnet();
  const privateKey = 'edf9aee84d9b7abc145504dde6726c64f369d37ee34ded868fabd876c26570bc01'; // Deployer private key from devnet.toml

  const contracts = [
    { name: 'mock-xfi-token', path: './contracts/stacks/mock-xfi-token.clar' },
    { name: 'mock-sbtc-token', path: './contracts/stacks/mock-sbtc-token.clar' },
    { name: 'mock-stx-token', path: './contracts/stacks/mock-stx-token.clar' },
    { name: 'sbtc-bridge', path: './contracts/stacks/sbtc-bridge.clar' }
  ];

  for (const contract of contracts) {
    console.log(`Deploying ${contract.name}...`);
    await deployContract(contract.name, contract.path, network, privateKey);
  }

  console.log('Stacks devnet deployment completed');
}

async function deployContract(contractName, contractPath, network, privateKey) {
  const codeBody = fs.readFileSync(contractPath).toString();

  const transaction = await makeContractDeploy({
    codeBody,
    contractName,
    senderKey: privateKey,
    network,
    anchorMode: AnchorMode.Any,
  });

  console.log(`Broadcasting ${contractName} deployment transaction...`);
  const result = await broadcastTransaction(transaction, network);
  console.log(`${contractName} deployment result:`, result);

  if (result.error) {
    throw new Error(`Failed to deploy ${contractName}: ${result.error}`);
  }

  console.log(`${contractName} deployed successfully`);
  console.log(`Contract address: ${getAddressFromPrivateKey(privateKey)}.${contractName}`);
}

deployStacksContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });