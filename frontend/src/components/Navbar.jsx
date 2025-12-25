import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">🎫</span>
            Q-Ease
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/organizations" className="hover:text-blue-200 transition">Organizations</Link>
            <Link to="/my-tokens" className="hover:text-blue-200 transition">My Tokens</Link>
            <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;