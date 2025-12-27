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

  const isAdmin = user && (user.role === 'manager' || user.role === 'owner');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span>🎫</span>
            Q-Ease
          </Link>
          
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/organizations" className="navbar-link">Organizations</Link>
            <Link to="/my-tokens" className="navbar-link">My Tokens</Link>
            
            {isAuthenticated && (
              <>
                {isAdmin && location.pathname.startsWith('/admin') ? (
                  <Link to="/" className="navbar-link">User View</Link>
                ) : isAdmin && !location.pathname.startsWith('/admin') ? (
                  <Link to="/admin" className="navbar-link">Admin Panel</Link>
                ) : null}
                <button 
                  onClick={handleLogout}
                  className="navbar-link logout-btn"
                >
                  Logout
                </button>
              </>
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