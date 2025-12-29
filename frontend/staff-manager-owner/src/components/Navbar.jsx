import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isStaff = user && (user.role === 'staff' || user.role === 'manager' || user.role === 'owner');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span>🎫</span>
            Q-Ease
          </Link>
          
          <div className="navbar-links">
            {isAuthenticated && isStaff && (
              <>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/queues" className="navbar-link">Queues</Link>
                <Link to="/my-tokens" className="navbar-link">My Tokens</Link>
                {user.role === 'manager' || user.role === 'owner' ? (
                  <Link to="/analytics" className="navbar-link">Analytics</Link>
                ) : null}
              </>
            )}
            
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="navbar-link logout-btn"
              >
                Logout
              </button>
            )}
            
            {!isAuthenticated && (
              <Link to="/login" className="navbar-link">Login</Link>
            )}
            
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;