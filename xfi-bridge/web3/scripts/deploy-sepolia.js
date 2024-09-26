import hre from "hardhat";

async function deployCrossFiContracts() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock XFI Token
  const MockXFIToken = await hre.ethers.getContractFactory("MockXFIToken");
  const xfiToken = await MockXFIToken.deploy();
  await xfiToken.deployed();
  console.log("MockXFIToken deployed to:", xfiToken.address);

  // Deploy Mock sBTC Token
  const MockSBTCToken = await hre.ethers.getContractFactory("MockSBTCToken");
  const sbtcToken = await MockSBTCToken.deploy();
  await sbtcToken.deployed();
  console.log("MockSBTCToken deployed to:", sbtcToken.address);

  // Deploy Mock STX Token
  const MockSTXToken = await hre.ethers.getContractFactory("MockSTXToken");
  const stxToken = await MockSTXToken.deploy();
  await stxToken.deployed();
  console.log("MockSTXToken deployed to:", stxToken.address);

  // Deploy SBTCBridge
  const SBTCBridge = await hre.ethers.getContractFactory("SBTCBridge");
  const sbtcBridge = await SBTCBridge.deploy(xfiToken.address, sbtcToken.address, stxToken.address);
  await sbtcBridge.deployed();
  console.log("SBTCBridge deployed to:", sbtcBridge.address);

  // Set initial prices (example values)
  const sbtcPrice = hre.ethers.utils.parseEther("30000");
  const xfiPrice = hre.ethers.utils.parseEther("1");
  const stxPrice = hre.ethers.utils.parseEther("0.5");

  await sbtcBridge.updatePrices(sbtcPrice, xfiPrice, stxPrice);
  console.log("Initial prices set");

  console.log("Deployment completed");
}

deployCrossFiContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });