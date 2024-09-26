const hre = require("hardhat");

async function deployCrossFiContract() {
  const SBTCBridge = await hre.ethers.getContractFactory("SBTCBridge");
  const xfiTokenAddress = "0x..."; // Replace with actual XFI token address on CrossFi

  const sbtcBridge = await SBTCBridge.deploy(xfiTokenAddress);
  await sbtcBridge.deployed();

  console.log("SBTCBridge deployed to:", sbtcBridge.address);
}

deployCrossFiContract().catch((error) => {
  console.error(error);
  process.exit(1);
});