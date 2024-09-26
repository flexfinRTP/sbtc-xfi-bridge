const hre = require("hardhat");

async function deployCrossFiContracts() {
  console.log('Starting CrossFi testnet deployment...');

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const contracts = [
    { name: 'MockXFIToken', factory: await hre.ethers.getContractFactory("MockXFIToken") },
    { name: 'MockSBTCToken', factory: await hre.ethers.getContractFactory("MockSBTCToken") },
    { name: 'MockSTXToken', factory: await hre.ethers.getContractFactory("MockSTXToken") }
  ];

  const deployedContracts = {};

  for (const contract of contracts) {
    console.log(`Deploying ${contract.name}...`);
    const deployedContract = await contract.factory.deploy();
    await deployedContract.deployed();
    deployedContracts[contract.name] = deployedContract;
    console.log(`${contract.name} deployed to:`, deployedContract.address);
  }

  console.log('Deploying SBTCBridge...');
  const SBTCBridge = await hre.ethers.getContractFactory("SBTCBridge");
  const sbtcBridge = await SBTCBridge.deploy(
    deployedContracts.MockXFIToken.address,
    deployedContracts.MockSBTCToken.address,
    deployedContracts.MockSTXToken.address
  );
  await sbtcBridge.deployed();
  console.log("SBTCBridge deployed to:", sbtcBridge.address);

  console.log('Setting initial prices...');
  const sbtcPrice = hre.ethers.utils.parseEther("30000");
  const xfiPrice = hre.ethers.utils.parseEther("1");
  const stxPrice = hre.ethers.utils.parseEther("0.5");

  await sbtcBridge.updatePrices(sbtcPrice, xfiPrice, stxPrice);
  console.log("Initial prices set");

  console.log('CrossFi testnet deployment completed');
  
  // Log all deployed contract addresses
  console.log('\nDeployed Contract Addresses:');
  for (const [name, contract] of Object.entries(deployedContracts)) {
    console.log(`${name}: ${contract.address}`);
  }
  console.log(`SBTCBridge: ${sbtcBridge.address}`);
}

deployCrossFiContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });