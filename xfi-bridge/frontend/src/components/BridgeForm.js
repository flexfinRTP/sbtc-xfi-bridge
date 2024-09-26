import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaBitcoin, FaStackOverflow } from 'react-icons/fa';
import { SiHiveblockchain } from 'react-icons/si';
import { initiateStacksTransfer, initiateXfiTransfer } from '../utils/contracts';
import { initiateTransfer, confirmStacksTransfer } from '../utils/api';

const BridgeForm = () => {
  const [fromChain, setFromChain] = useState('stacks');
  const [toChain, setToChain] = useState('crossfi');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [prices, setPrices] = useState({ btc: 0, xfi: 0, stx: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,crossfi-2,blockstack&vs_currencies=usd');
        setPrices({
          btc: response.data.bitcoin.usd,
          xfi: response.data['crossfi-2'].usd,
          stx: response.data['blockstack'].usd
        });
      } catch (error) {
        console.error('Error fetching prices:', error);
        setError('Failed to fetch current prices. Please try again later.');
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (fromChain === 'stacks') {
        await initiateStacksTransfer(amount, recipient);
      } else {
        const txHash = await initiateXfiTransfer(amount, recipient);
        await initiateTransfer(fromChain, toChain, amount, '', recipient);
        console.log('Transfer initiated:', txHash);
      }
    } catch (error) {
      console.error('Error initiating transfer:', error);
      setError('Failed to initiate transfer. Please try again.');
    }
  };

  const chainOptions = [
    { value: 'stacks', label: 'Stacks', icon: FaStackOverflow },
    { value: 'crossfi', label: 'CrossFi', icon: SiHiveblockchain },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-2xl max-w-md w-full mx-auto mt-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['from', 'to'].map((direction) => (
            <div key={direction}>
              <label htmlFor={`${direction}Chain`} className="block text-sm font-medium text-gray-300 mb-1">
                {direction.charAt(0).toUpperCase() + direction.slice(1)} Chain
              </label>
              <select
                id={`${direction}Chain`}
                value={direction === 'from' ? fromChain : toChain}
                onChange={(e) => direction === 'from' ? setFromChain(e.target.value) : setToChain(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Select ${direction} chain`}
              >
                {chainOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              aria-label="Enter amount"
            />
            <FaBitcoin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500" />
          </div>
        </div>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter recipient address"
            aria-label="Enter recipient address"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Initiate Transfer
        </motion.button>
        <div className="flex justify-between text-sm text-gray-400">
          <p>sBTC: ${prices.btc.toFixed(2)}</p>
          <p>XFI: ${prices.xfi.toFixed(2)}</p>
          <p>STX: ${prices.stx.toFixed(2)}</p>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </motion.div>
  );
};

export default BridgeForm;