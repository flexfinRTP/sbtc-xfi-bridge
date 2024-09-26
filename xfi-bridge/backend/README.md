# XFI-sBTC Bridge

This project implements a bridge between CrossFi (XFI) and Stacks Bitcoin (sBTC).

## Backend Functions

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

### API Endpoints

1. POST `/api/bridge/initiate-transfer`: Initiates a transfer between chains.
2. GET `/api/bridge/transaction/:txId`: Gets the status of a transaction.
3. GET `/api/price/prices`: Gets the current prices of sBTC and XFI.
4. POST `/api/bridge/confirm-stacks-transfer`: Confirms a Stacks transfer.

## Testing

To run backend tests:
```
cd backend
npm test
```
## Deployment

Follow the deployment instructions for your preferred hosting platform for both the backend.

Make sure to set the necessary environment variables before deploying.