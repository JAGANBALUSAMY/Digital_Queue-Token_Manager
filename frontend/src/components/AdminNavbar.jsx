import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/admin" className="text-xl font-bold flex items-center">
            <span className="mr-2">🏢</span>
            Q-Ease Admin
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/admin/dashboard" className="hover:text-gray-300 transition">Dashboard</Link>
            <Link to="/admin/queues" className="hover:text-gray-300 transition">Queues</Link>
            <Link to="/admin/organizations" className="hover:text-gray-300 transition">Organizations</Link>
            <Link to="/admin/analytics" className="hover:text-gray-300 transition">Analytics</Link>
            <Link to="/admin/settings" className="hover:text-gray-300 transition">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;