const { StacksTestnet, StacksMocknet } = require('@stacks/network');
const { makeContractDeploy } = require('@stacks/transactions');
const { readFileSync } = require('fs');

async function deployStacksContract() {
  const network = new StacksTestnet(); // Use StacksMocknet() for local development
  const privateKey = process.env.STACKS_PRIVATE_KEY;
  const contractName = 'sbtc-bridge';

  const codeBody = readFileSync('./contracts/stacks/sbtc-bridge.clar').toString();

  const transaction = await makeContractDeploy({
    contractName,
    codeBody,
    senderKey: privateKey,
    network,
  });

  const result = await network.broadcastTransaction(transaction);
  console.log('Stacks contract deployment result:', result);
}

deployStacksContract().catch(console.error);