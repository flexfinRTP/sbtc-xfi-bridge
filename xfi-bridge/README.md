# XFI-sBTC Bridge

This project implements a bridge between CrossFi (XFI) and Stacks Bitcoin (sBTC).

## Contract Functions

### Stacks Contract (sbtc-bridge.clar)

1. `(deposit (token <ft-trait>) (amount uint))`
   - Deposits sBTC into the bridge.
   - Parameters:
     - `token`: The sBTC token trait
     - `amount`: Amount of sBTC to deposit

2. `(withdraw (token <ft-trait>) (amount uint))`
   - Withdraws sBTC from the bridge.
   - Parameters:
     - `token`: The sBTC token trait
     - `amount`: Amount of sBTC to withdraw

3. `(initiate-crosschain-transfer (amount uint) (recipient (buff 32)))`
   - Initiates a cross-chain transfer to CrossFi.
   - Parameters:
     - `amount`: Amount of sBTC to transfer
     - `recipient`: CrossFi recipient address

4. `(confirm-crosschain-transfer (txid (buff 32)))`
   - Confirms a cross-chain transfer from CrossFi.
   - Parameters:
     - `txid`: Transaction ID of the CrossFi transfer

5. `(update-prices (new-sbtc-price uint) (new-xfi-price uint))`
   - Updates the prices of sBTC and XFI.
   - Parameters:
     - `new-sbtc-price`: New sBTC price
     - `new-xfi-price`: New XFI price

### CrossFi Contract (SBTCBridge.sol)

1. `deposit(uint256 amount)`
   - Deposits XFI into the bridge.
   - Parameters:
     - `amount`: Amount of XFI to deposit

2. `withdraw(uint256 amount)`
   - Withdraws XFI from the bridge.
   - Parameters:
     - `amount`: Amount of XFI to withdraw

3. `initiateCrossChainTransfer(uint256 amount, bytes32 stacksRecipient)`
   - Initiates a cross-chain transfer to Stacks.
   - Parameters:
     - `amount`: Amount of XFI to transfer
     - `stacksRecipient`: Stacks recipient address

4. `confirmCrossChainTransfer(bytes32 stacksTxId)`
   - Confirms a cross-chain transfer from Stacks.
   - Parameters:
     - `stacksTxId`: Transaction ID of the Stacks transfer

5. `updatePrices(uint256 newSbtcPrice, uint256 newXfiPrice)`
   - Updates the prices of sBTC and XFI.
   - Parameters:
     - `newSbtcPrice`: New sBTC price
     - `newXfiPrice`: New XFI price

## Running Tests

To run Stacks contract tests:
```
npm run test:stacks
```

To run CrossFi contract tests:
```
npm run test:crossfi
```

## Deployment

To deploy the Stacks contract:
```
node scripts/deploy-stacks.js
```

To deploy the CrossFi contract:
```
npx hardhat run scripts/deploy-crossfi.js --network crossfi
```

Make sure to set the necessary environment variables before running the deployment scripts.