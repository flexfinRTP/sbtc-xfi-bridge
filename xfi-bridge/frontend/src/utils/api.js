import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const initiateTransfer = async (fromChain, toChain, amount, currency, fromAddress, toAddress) => {
  const response = await api.post('/bridge/initiate-transfer', {
    fromChain,
    toChain,
    amount,
    currency,
    fromAddress,
    toAddress,
  });
  return response.data;
};

export const getTransactionStatus = async (txId) => {
  const response = await api.get(`/bridge/transaction/${txId}`);
  return response.data;
};

export const getPrices = async () => {
  const response = await api.get('/bridge/prices');
  return response.data;
};

export const confirmStacksTransfer = async (txId) => {
  const response = await api.post('/bridge/confirm-stacks-transfer', { txId });
  return response.data;
};

export const confirmCrossfiTransfer = async (txId) => {
  const response = await api.post('/bridge/confirm-crossfi-transfer', { txId });
  return response.data;
};