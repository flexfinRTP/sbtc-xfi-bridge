# XFI-sBTC Bridge Frontend

This project implements a bridge between CrossFi (XFI) and Stacks Bitcoin (sBTC).

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

### Frontend

1. Navigate to the frontend directory:
   ```
   cd xfi-bridge/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

## Testing

To run frontend tests:
```
cd frontend
npm test
```

## Deployment

Follow the deployment instructions for your preferred hosting platform for both the frontend.

Make sure to set the necessary environment variables before deploying.