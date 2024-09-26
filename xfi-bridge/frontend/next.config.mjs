/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      STACKS_NETWORK: process.env.STACKS_NETWORK,
      CROSSFI_RPC_URL: process.env.CROSSFI_RPC_URL,
    },
};

export default nextConfig;
