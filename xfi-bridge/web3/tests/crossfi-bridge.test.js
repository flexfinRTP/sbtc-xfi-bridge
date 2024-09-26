const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SBTCBridge", function () {
  let SBTCBridge, sbtcBridge, XFIToken, xfiToken, SBTCToken, sbtcToken, STXToken, stxToken, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    XFIToken = await ethers.getContractFactory("XFIToken");
    xfiToken = await XFIToken.deploy();

    SBTCToken = await ethers.getContractFactory("SBTCToken");
    sbtcToken = await SBTCToken.deploy();

    STXToken = await ethers.getContractFactory("STXToken");
    stxToken = await STXToken.deploy();

    SBTCBridge = await ethers.getContractFactory("SBTCBridge");
    sbtcBridge = await SBTCBridge.deploy(xfiToken.address, sbtcToken.address, stxToken.address);
  });

  it("Should deposit XFI", async function () {
    const depositAmount = ethers.utils.parseEther("100");
    await xfiToken.approve(sbtcBridge.address, depositAmount);
    await sbtcBridge.deposit(xfiToken.address, depositAmount);

    expect(await sbtcBridge.getUserBalance(owner.address, xfiToken.address)).to.equal(depositAmount);
  });

  it("Should deposit sBTC", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    await sbtcToken.approve(sbtcBridge.address, depositAmount);
    await sbtcBridge.deposit(sbtcToken.address, depositAmount);

    expect(await sbtcBridge.getUserBalance(owner.address, sbtcToken.address)).to.equal(depositAmount);
  });

  it("Should deposit STX", async function () {
    const depositAmount = ethers.utils.parseEther("1000");
    await stxToken.approve(sbtcBridge.address, depositAmount);
    await sbtcBridge.deposit(stxToken.address, depositAmount);

    expect(await sbtcBridge.getUserBalance(owner.address, stxToken.address)).to.equal(depositAmount);
  });

  it("Should initiate cross-chain transfer for XFI", async function () {
    const transferAmount = ethers.utils.parseEther("50");
    const stacksRecipient = ethers.utils.formatBytes32String("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");

    await xfiToken.approve(sbtcBridge.address, transferAmount);
    await sbtcBridge.deposit(xfiToken.address, transferAmount);
    
    await expect(sbtcBridge.initiateCrossChainTransfer(xfiToken.address, transferAmount, stacksRecipient))
      .to.emit(sbtcBridge, "CrossChainTransferInitiated")
      .withArgs(owner.address, xfiToken.address, transferAmount, stacksRecipient);

    expect(await sbtcBridge.getUserBalance(owner.address, xfiToken.address)).to.equal(0);
  });

  it("Should initiate cross-chain transfer for sBTC", async function () {
    const transferAmount = ethers.utils.parseEther("0.5");
    const stacksRecipient = ethers.utils.formatBytes32String("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");

    await sbtcToken.approve(sbtcBridge.address, transferAmount);
    await sbtcBridge.deposit(sbtcToken.address, transferAmount);
    
    await expect(sbtcBridge.initiateCrossChainTransfer(sbtcToken.address, transferAmount, stacksRecipient))
      .to.emit(sbtcBridge, "CrossChainTransferInitiated")
      .withArgs(owner.address, sbtcToken.address, transferAmount, stacksRecipient);

    expect(await sbtcBridge.getUserBalance(owner.address, sbtcToken.address)).to.equal(0);
  });

  it("Should confirm cross-chain transfer", async function () {
    const transferAmount = ethers.utils.parseEther("50");
    const stacksRecipient = ethers.utils.formatBytes32String("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");

    await xfiToken.approve(sbtcBridge.address, transferAmount);
    await sbtcBridge.deposit(xfiToken.address, transferAmount);
    
    await sbtcBridge.initiateCrossChainTransfer(xfiToken.address, transferAmount, stacksRecipient);

    const stacksTxId = ethers.utils.formatBytes32String("0x1234567890abcdef");
    
    await expect(sbtcBridge.connect(owner).confirmCrossChainTransfer(stacksTxId))
      .to.emit(sbtcBridge, "CrossChainTransferConfirmed")
      .withArgs(stacksTxId, owner.address, xfiToken.address, transferAmount);

    expect(await sbtcBridge.getUserBalance(owner.address, xfiToken.address)).to.equal(transferAmount);
  });

  it("Should update prices", async function () {
    const newSbtcPrice = ethers.utils.parseEther("30000");
    const newXfiPrice = ethers.utils.parseEther("1");
    const newStxPrice = ethers.utils.parseEther("0.5");

    await expect(sbtcBridge.connect(owner).updatePrices(newSbtcPrice, newXfiPrice, newStxPrice))
      .to.emit(sbtcBridge, "PricesUpdated")
      .withArgs(newSbtcPrice, newXfiPrice, newStxPrice);

    const prices = await sbtcBridge.prices();
    expect(prices.sbtcPrice).to.equal(newSbtcPrice);
    expect(prices.xfiPrice).to.equal(newXfiPrice);
    expect(prices.stxPrice).to.equal(newStxPrice);
  });

  it("Should fail to initiate cross-chain transfer with insufficient balance", async function () {
    const transferAmount = ethers.utils.parseEther("100");
    const stacksRecipient = ethers.utils.formatBytes32String("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");

    await expect(sbtcBridge.initiateCrossChainTransfer(xfiToken.address, transferAmount, stacksRecipient))
      .to.be.revertedWith("Insufficient balance");
  });

  it("Should fail to withdraw with insufficient balance", async function () {
    const withdrawAmount = ethers.utils.parseEther("100");

    await expect(sbtcBridge.withdraw(xfiToken.address, withdrawAmount))
      .to.be.revertedWith("Insufficient balance");
  });
});