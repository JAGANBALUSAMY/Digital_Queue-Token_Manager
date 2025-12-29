import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Login API call
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token and user data
        login(data.data, data.token);
        
        // Redirect based on role - all staff/manager/owner roles go to admin dashboard
        if (data.data.role === 'staff' || data.data.role === 'manager' || data.data.role === 'owner') {
          navigate('/dashboard');
        } else {
          // For other roles, redirect to appropriate page
          navigate('/');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-icon">🎫</div>
          <h1 className="brand-name">Q-Ease</h1>
        </div>
        
        {/* Auth Card */}
        <div className="auth-card">
          <h2 className="auth-title">
            Staff/Manager/Owner Login
          </h2>
          <p className="auth-subtitle">
            Access your organization dashboard
          </p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="name@company.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </form>
          
          <div className="auth-footer">
            <p className="admin-note">
              Only staff, manager, and owner accounts can access this portal.
            </p>
          </div>
        </div>
        
        {/* Terms & Privacy */}
        <div className="legal-text">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="legal-link">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="legal-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;