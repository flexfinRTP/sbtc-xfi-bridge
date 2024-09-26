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

## Frontend Functions

### Components

1. `BridgeForm`: Handles user input for initiating transfers between chains.
2. `Header`: Displays the application header and navigation.
3. `Footer`: Displays the application footer.

### Utilities

1. `api.js`: Contains functions for interacting with the backend API.
2. `contracts.js`: Contains functions for interacting with blockchain contracts.

### Pages

1. `bridge.js`: Main page for the bridge functionality.

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```
   cd xfi-sbtc-bridge/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd xfi-sbtc-bridge/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## Testing

To run backend tests:
```
cd backend
npm test
```

To run frontend tests:
```
cd frontend
npm test
```

## Deployment

Follow the deployment instructions for your preferred hosting platform for both the backend and frontend.

Make sure to set the necessary environment variables before deploying.