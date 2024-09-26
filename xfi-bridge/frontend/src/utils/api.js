import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const initiateTransfer = async (fromChain, toChain, amount, fromAddress, toAddress) => {
  const response = await api.post('/bridge/initiate-transfer', {
    fromChain,
    toChain,
    amount,
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
  const response = await api.get('/price/prices');
  return response.data;
};

export const confirmStacksTransfer = async (txId) => {
  const response = await api.post('/bridge/confirm-stacks-transfer', { txId });
  return response.data;
};