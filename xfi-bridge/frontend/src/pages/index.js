import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const App = () => {
  return (
    <div>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-white mb-8">XFI-sBTC Bridge</h1>
        <p className="text-xl text-white mb-12">Seamlessly transfer assets between Stacks and CrossFi</p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link legacyBehavior href="/bridge" passHref>
            <a className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition duration-300">
              Enter Bridge
            </a>
          </Link>
        </motion.div>
      </motion.div>
    </div>
    <Footer />
    </div>
  );
};

export default App;