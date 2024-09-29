import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStackOverflow,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { SiHiveblockchain } from "react-icons/si";
import { useConnect } from "@stacks/connect-react";
// import { initiateStacksTransfer, initiateXfiTransfer } from '../utils/contracts';
import {
  initiateTransfer,
  getTransactionStatus,
  getPrices,
} from "../utils/api";
import TransactionStatus from "./TransactionStatus";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const BridgeForm = () => {
  const { userSession } = useConnect();
  const [fromChain, setFromChain] = useState("stacks");
  const [toChain, setToChain] = useState("crossfi");
  const [currency, setCurrency] = useState("stx");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [prices, setPrices] = useState({ btc: 0, xfi: 0, stx: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [txId, setTxId] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,crossfi-2,blockstack&vs_currencies=usd"
        );
        setPrices({
          btc: response.data.bitcoin.usd,
          xfi: response.data["crossfi-2"].usd,
          stx: response.data.blockstack.usd,
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
        setError("Failed to fetch current prices. Please try again later.");
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (txId) {
      const checkStatus = async () => {
        try {
          const status = await getTransactionStatus(txId);
          setTxStatus(status);
          if (status.status === "completed" || status.status === "failed") {
            clearInterval(statusInterval);
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
        }
      };
      const statusInterval = setInterval(checkStatus, 10000);
      return () => clearInterval(statusInterval);
    }
  }, [txId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setShowConfirmation(false);
    setTxId(null);
    setTxStatus(null);
    try {
      const response = await initiateTransfer(
        fromChain,
        toChain,
        amount,
        currency,
        recipient
      );
      setTxId(response.txId);
      setSuccess(
        `Transfer initiated successfully. Transaction ID: ${response.txId}`
      );
      setShowStatusModal(true);
    } catch (error) {
      console.error("Error initiating transfer:", error);
      setError(
        error.message || "Failed to initiate transfer. Please try again."
      );
    }
  };

  const chainOptions = [
    { value: "stacks", label: "Stacks", icon: FaStackOverflow },
    { value: "crossfi", label: "CrossFi", icon: SiHiveblockchain },
  ];

  const currencyOptions = [
    { value: "stx", label: "STX", decimals: 0 },
    { value: "xfi", label: "XFI", decimals: 0 },
    { value: "sbtc", label: "sBTC", decimals: 8 },
  ];

  const getCurrencySymbol = () => {
    switch (currency) {
      case "stx":
        return "STX";
      case "xfi":
        return "XFI";
      case "sbtc":
        return "₿";
      default:
        return "";
    }
  };

  const formatAmount = (value) => {
    const decimals = currencyOptions.find(
      (opt) => opt.value === currency
    ).decimals;
    return parseFloat(value).toFixed(decimals);
  };

  const handleFromChainChange = (value) => {
    setFromChain(value);
    setToChain(value === "stacks" ? "crossfi" : "stacks");
  };

  const validateAmount = (value) => {
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid positive number");
      return false;
    }
    setError("");
    return true;
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-2xl max-w-md w-full mx-auto mt-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["from", "to"].map((direction) => (
            <div key={direction}>
              <label
                htmlFor={`${direction}Chain`}
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {direction.charAt(0).toUpperCase() + direction.slice(1)} Chain
              </label>
              <select
                id={`${direction}Chain`}
                value={direction === "from" ? fromChain : toChain}
                onChange={(e) =>
                  direction === "from"
                    ? handleFromChainChange(e.target.value)
                    : null
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Select ${direction} chain`}
                disabled={direction === "to"}
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
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select currency"
          >
            {currencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (validateAmount(value)) {
                  setAmount(formatAmount(value));
                }
              }}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
              aria-label="Enter amount"
              step={currency === "sbtc" ? "0.00000001" : "1"}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500">
              {getCurrencySymbol()}
            </span>
          </div>
        </div>
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Recipient Address for{" "}
            {toChain.charAt(0).toUpperCase() + toChain.slice(1)}
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${toChain} recipient address`}
            aria-label={`Enter ${toChain} recipient address`}
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
          <p>sBTC: ${prices.btc.toFixed(0)}</p>
          <p>XFI: ${prices.xfi.toFixed(2)}</p>
          <p>STX: ${prices.stx.toFixed(2)}</p>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
      </form>

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Confirm Transaction
        </h2>
        <p className="text-gray-300 mb-2">From: {fromChain}</p>
        <p className="text-gray-300 mb-2">To: {toChain}</p>
        <p className="text-gray-300 mb-2">
          Amount: {amount} {getCurrencySymbol()}
        </p>
        <p className="text-gray-300 mb-4">Recipient: {recipient}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmation(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={confirmTransfer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </Modal>

      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)}>
        <AnimatePresence>
          {txStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Transaction Status
              </h2>
              <div className="flex items-center justify-between mb-6">
                {txStatus.status === "completed" && (
                  <FaCheckCircle className="text-green-500 text-2xl" />
                )}
                {txStatus.status === "failed" && (
                  <FaExclamationCircle className="text-red-500 text-2xl" />
                )}
                {txStatus.status === "processing" && (
                  <FaSpinner className="text-blue-500 text-2xl animate-spin" />
                )}
                <span className="text-white">{txStatus.status}</span>
              </div>
              <p className="text-gray-300 mb-2">Transaction ID: {txId}</p>
              <p className="text-gray-300 mb-2">From: {fromChain}</p>
              <p className="text-gray-300 mb-2">To: {toChain}</p>
              <p className="text-gray-300 mb-2">
                Amount: {amount} {getCurrencySymbol()}
              </p>
              <p className="text-gray-300 mb-4">
                Estimated Time:{" "}
                {fromChain === "stacks" ? "10-20 minutes" : "30-60 seconds"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </motion.div>
  );
};

export default BridgeForm;
