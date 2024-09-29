# XFI-sBTC Bridge Contracts

## Overview

This application provides a bridge between the Stacks blockchain (sBTC) and the CrossFi blockchain (XFI). It allows users to transfer assets between these two chains in a decentralized manner.

## Running Tests

To run Stacks contract tests:
```
clarinet devnet start
npm run test:stacks
node test/stacks-tests.js
```

To run CrossFi contract tests:
```
npm run test:crossfi
npx hardhat test test/ethereum-tests.js --network sepolia
```

## Deployment

To deploy the Stacks contract:
```
node scripts/deploy-devnet.js
node scripts/deploy-stacks.js
```

To deploy the CrossFi contract:
```
npx hardhat run scripts/deploy-crossfi.js --network crossfi
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

Interact with contracts (Hardhat console)
`npx hardhat console --network sepolia`

```
const SBTCBridge = await ethers.getContractFactory("SBTCBridge");
const bridge = await SBTCBridge.attach("DEPLOYED_BRIDGE_ADDRESS");

// Update prices (admin function)
await bridge.updatePrices(
  ethers.utils.parseEther("30000"), // sBTC price
  ethers.utils.parseEther("1"),     // XFI price
  ethers.utils.parseEther("0.5")    // STX price
);

// Public mint for each token
const MockXFIToken = await ethers.getContractFactory("MockXFIToken");
const xfiToken = await MockXFIToken.attach("DEPLOYED_XFI_ADDRESS");
await xfiToken.publicMint();

const MockSBTCToken = await ethers.getContractFactory("MockSBTCToken");
const sbtcToken = await MockSBTCToken.attach("DEPLOYED_SBTC_ADDRESS");
await sbtcToken.publicMint();

const MockSTXToken = await ethers.getContractFactory("MockSTXToken");
const stxToken = await MockSTXToken.attach("DEPLOYED_STX_ADDRESS");
await stxToken.publicMint();
```

Interact with Stacks CLI
`STACKS_PRIVATE_KEY=your_private_key node scripts/deploy-stacks.js`
```
// Public mint for each token
stx call_contract_func mock-xfi-token public-mint --fee 1000 --wait
stx call_contract_func mock-sbtc-token public-mint --fee 1000 --wait
stx call_contract_func mock-stx-token public-mint --fee 1000 --wait

// Update prices (admin function)
stx call_contract_func sbtc-bridge update-prices u3000000000000 u100000000 u50000000 --fee 1000 --wait
```


Make sure to set the necessary environment variables before running the deployment scripts.

### Stacks Contract (sbtc-bridge.clar)

1. `deposit`: Deposits sBTC into the bridge.
2. `withdraw`: Withdraws sBTC from the bridge.
3. `initiate-crosschain-transfer`: Initiates a cross-chain transfer to CrossFi.
4. `confirm-crosschain-transfer`: Confirms a cross-chain transfer from CrossFi.
5. `update-prices`: Updates the prices of sBTC and XFI.

### CrossFi Contract (SBTCBridge.sol)

1. `deposit`: Deposits XFI into the bridge.
2. `withdraw`: Withdraws XFI from the bridge.
3. `initiateCrossChainTransfer`: Initiates a cross-chain transfer to Stacks.
4. `confirmCrossChainTransfer`: Confirms a cross-chain transfer from Stacks.
5. `updatePrices`: Updates the prices of sBTC and XFI.
