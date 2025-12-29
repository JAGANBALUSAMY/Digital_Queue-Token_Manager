import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">🏢</span>
            Q-Ease Dashboard
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/dashboard" className="hover:text-gray-300 transition">Dashboard</Link>
            <Link to="/queues" className="hover:text-gray-300 transition">Queues</Link>
            <Link to="/my-tokens" className="hover:text-gray-300 transition">My Tokens</Link>
            <Link to="/analytics" className="hover:text-gray-300 transition">Analytics</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;