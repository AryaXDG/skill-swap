import React from 'react';
import LandingScene from '../components/scenes/LandingScene';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaUserPlus } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 3D Background Scene */}
      <LandingScene />

      {/* Overlay Content */}
      <div className="relative z-10 text-center p-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4"
        >
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-glow">
            SkillSwap
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-2xl text-dark-50 max-w-2xl mx-auto mb-10"
        >
          The place where your knowledge finds its perfect match. Share what you know, learn what you don't.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            variant="primary"
            className="animation-pulse-glow"
            icon={FaExchangeAlt}
          >
            <Link to="/dashboard">Find a Match</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            icon={FaUserPlus}
          >
            <Link to="/register">Get Started</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;