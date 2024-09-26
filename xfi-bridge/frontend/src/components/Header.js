import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { ethers } from 'ethers';

const Header = () => {
  const { authentication, openAuthRequest } = useConnect();
  const [stacksAddress, setStacksAddress] = useState(null);
  const [xfiAddress, setXfiAddress] = useState(null);

  useEffect(() => {
    if (authentication && authentication.isSignedIn()) {
      setStacksAddress(authentication.stxAddress);
    }
  }, [authentication]);

  const connectStacks = () => {
    openAuthRequest();
  };

  const connectXfi = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setXfiAddress(address);
      } catch (error) {
        console.error('Failed to connect to MetaMask', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">XFI-sBTC Bridge</h1>
        <div className="flex space-x-4">
          <button
            onClick={connectStacks}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            {stacksAddress ? `Stacks: ${stacksAddress.slice(0, 6)}...` : 'Connect Stacks'}
          </button>
          <button
            onClick={connectXfi}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            {xfiAddress ? `XFI: ${xfiAddress.slice(0, 6)}...` : 'Connect XFI'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;