require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/la7AYhPOS3ubGAHyIXuLrIwjh29meJ77",
      accounts: [process.env.CROSSFI_PRIVATE_KEY],
    },
    crossfi: {
      url: "https://testnet-rpc.crossfi.com", // Replace with actual CrossFi testnet RPC URL
      accounts: [process.env.CROSSFI_PRIVATE_KEY],
      chainId: 4242, // Replace with actual CrossFi testnet chain ID
    },
  },
};
