const { makeContractDeploy, broadcastTransaction, AnchorMode } = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');
const fs = require('fs');

async function deployStacksContracts() {
  const network = new StacksTestnet();
  const mnemonic = process.env.STACKS_MNEMONIC;
  
  if (!mnemonic) {
    throw new Error('STACKS_MNEMONIC environment variable not set');
  }

  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: 'password', // You can use any string here
  });

  const privateKey = wallet.accounts[0].stxPrivateKey;

  console.log('Deploying Stacks contracts...');

  // Deploy Mock XFI Token contract
  await deployContract('mock-xfi-token', './contracts/mock-xfi-token.clar', network, privateKey);

  // Deploy Mock sBTC Token contract
  await deployContract('mock-sbtc-token', './contracts/mock-sbtc-token.clar', network, privateKey);

  // Deploy Mock STX Token contract
  await deployContract('mock-stx-token', './contracts/mock-stx-token.clar', network, privateKey);

  // Deploy sBTC Bridge contract
  await deployContract('sbtc-bridge', './contracts/sbtc-bridge.clar', network, privateKey);

  console.log('Deployment completed');
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

  const result = await broadcastTransaction(transaction, network);
  console.log(`${contractName} deployment result:`, result);

  if (result.error) {
    throw new Error(`Failed to deploy ${contractName}: ${result.error}`);
  }
}

deployStacksContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });