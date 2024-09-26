import React from 'react';
import { motion } from 'framer-motion';
import BridgeForm from '../components/BridgeForm';
import AnimatedBackground from '../components/AnimatedBackground';

const BridgePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-8 relative overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-8"
        >
          XFI-sBTC Bridge
        </motion.h1>
        <BridgeForm />
      </div>
    </div>
  );
};

export default BridgePage;