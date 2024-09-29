import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { ethers } from 'ethers';

const Header = () => {
  const { userSession } = useConnect();
  const [stacksAddress, setStacksAddress] = useState(null);
  const [xfiAddress, setXfiAddress] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      if (userSession && typeof userSession.isUserSignedIn === 'function') {
        const isSignedIn = await userSession.isUserSignedIn();
        if (isSignedIn) {
          const userData = userSession.loadUserData();
          setStacksAddress(userData.profile.stxAddress.mainnet);
        }
      }
    };

    checkUserSession();
  }, [userSession]);

  const connectStacks = () => {
    showConnect({
      appDetails: {
        name: 'XFI-sBTC Bridge',
        icon: '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
    });
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

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">XFI-sBTC Bridge</h1>
        <div className="flex space-x-4">
          {stacksAddress ? (
            <div className="bg-blue-500 px-4 py-2 rounded">
              Stacks: {truncateAddress(stacksAddress)}
            </div>
          ) : (
            <button
              onClick={connectStacks}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Connect Stacks
            </button>
          )}
          {xfiAddress ? (
            <div className="bg-green-500 px-4 py-2 rounded">
              XFI: {truncateAddress(xfiAddress)}
            </div>
          ) : (
            <button
              onClick={connectXfi}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              Connect XFI
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;