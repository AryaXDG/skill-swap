import React from 'react';
import { FaFire } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-800 text-dark-50 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center">
           <FaFire className="text-primary text-xl" />
           <span className="ml-2 text-lg font-bold">SkillSwap</span>
        </div>
        <div className="text-sm mt-2 sm:mt-0">
          Created by Arya Dasgupta
        </div>
        <div className="text-sm text-dark-50 mt-2 sm:mt-0">
          © {new Date().getFullYear()} SkillSwap. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;