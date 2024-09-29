import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { getTransactionStatus } from '../utils/api';

const TransactionStatus = ({ txId }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (txId) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [txId]);

  const fetchStatus = async () => {
    try {
      const statusData = await getTransactionStatus(txId);
      setStatus(statusData);
      if (statusData.status === 'completed' || statusData.status === 'failed') {
        clearInterval(interval);
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      setError('Failed to fetch transaction status. Please try again later.');
    }
  };

  const getStatusIcon = () => {
    switch (status?.status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'failed':
        return <FaExclamationCircle className="text-red-500 text-2xl" />;
      default:
        return <FaSpinner className="text-blue-500 text-2xl animate-spin" />;
    }
  };

  const getEstimatedTime = () => {
    if (status?.fromChain === 'stacks') {
      return '10-20 minutes';
    } else if (status?.fromChain === 'crossfi') {
      return '30-60 seconds';
    }
    return 'Unknown';
  };

  const steps = [
    { label: 'Initiated', completed: true },
    { label: 'Processing', completed: status?.status === 'processing' || status?.status === 'completed' },
    { label: 'Completed', completed: status?.status === 'completed' },
  ];

  if (error) {
    return <p className="text-red-500 text-sm mt-2">{error}</p>;
  }

  if (!status) {
    return <p className="text-gray-400 text-sm mt-2">Loading transaction status...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Transaction Status</h2>
      <div className="flex items-center justify-between mb-6">
        {getStatusIcon()}
        <span className="text-white">{status.status}</span>
      </div>
      <div className="space-y-4">
        <p className="text-gray-300">Transaction ID: {txId}</p>
        <p className="text-gray-300">From Chain: {status.fromChain}</p>
        <p className="text-gray-300">To Chain: {status.toChain}</p>
        <p className="text-gray-300">Amount: {status.amount} {status.currency}</p>
        <p className="text-gray-300">Estimated Time: {getEstimatedTime()}</p>
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-blue-500' : 'bg-gray-600'}`}>
                {step.completed ? (
                  <FaCheckCircle className="text-white" />
                ) : (
                  <span className="text-white">{index + 1}</span>
                )}
              </div>
              <span className="text-xs text-gray-400 mt-2">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionStatus;