const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SBTCBridge", function () {
  let SBTCBridge, sbtcBridge, XFIToken, xfiToken, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    XFIToken = await ethers.getContractFactory("XFIToken");
    xfiToken = await XFIToken.deploy();

    SBTCBridge = await ethers.getContractFactory("SBTCBridge");
    sbtcBridge = await SBTCBridge.deploy(xfiToken.address);
  });

  it("Should deposit XFI", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await xfiToken.approve(sbtcBridge.address, depositAmount);
    await sbtcBridge.deposit(depositAmount);

    expect(await sbtcBridge.getUserBalance(owner.address)).to.equal(depositAmount);
  });

  it("Should initiate cross-chain transfer", async function () {
    const transferAmount = ethers.utils.parseEther("50");
    const stacksRecipient = ethers.utils.formatBytes32String("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");

    await xfiToken.approve(sbtcBridge.address, transferAmount);
    await sbtcBridge.deposit(transferAmount);
    
    await expect(sbtcBridge.initiateCrossChainTransfer(transferAmount, stacksRecipient))
      .to.emit(sbtcBridge, "CrossChainTransferInitiated")
      .withArgs(owner.address, transferAmount, stacksRecipient);
  });

  // Add more tests for other functions
});