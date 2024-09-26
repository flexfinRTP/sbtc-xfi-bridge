/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      STACKS_NETWORK: process.env.STACKS_NETWORK,
      CROSSFI_RPC_URL: process.env.CROSSFI_RPC_URL,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      REACT_APP_STACKS_CONTRACT_ADDRESS: process.env.REACT_APP_STACKS_CONTRACT_ADDRESS,
      REACT_APP_STACKS_CONTRACT_NAME: process.env.REACT_APP_STACKS_CONTRACT_NAME,
      REACT_APP_XFI_CONTRACT_ADDRESS: process.env.REACT_APP_XFI_CONTRACT_ADDRESS,
    },
};

export default nextConfig;
