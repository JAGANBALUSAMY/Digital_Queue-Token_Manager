import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    orgCode: ''
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
      if (isLogin) {
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
          
          // Redirect based on role
          if (data.data.role === 'manager' || data.data.role === 'owner') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } else {
        // Registration API call
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.name,
            phone: '+1234567890', // Default phone
            role: isAdminMode ? 'manager' : 'customer' // Set role based on mode
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Store token and user data
          login(data.data, data.token);
          
          // Redirect based on role
          if (data.data.role === 'manager' || data.data.role === 'owner') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          alert(data.message || 'Registration failed');
        }
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
        
        {/* User/Admin Toggle */}
        <div className="login-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${!isAdminMode ? 'active' : ''}`}
            onClick={() => setIsAdminMode(false)}
          >
            User Login
          </button>
          <button
            type="button"
            className={`mode-btn ${isAdminMode ? 'active' : ''}`}
            onClick={() => setIsAdminMode(true)}
          >
            Admin Login
          </button>
        </div>
        
        {/* Auth Card */}
        <div className="auth-card">
          <h2 className="auth-title">
            {isAdminMode 
              ? (isLogin ? 'Admin Portal' : 'Register as Admin') 
              : (isLogin ? 'Welcome back' : 'Create your account')}
          </h2>
          <p className="auth-subtitle">
            {isAdminMode
              ? (isLogin ? 'Access your admin dashboard' : 'Create admin account')
              : (isLogin ? 'Sign in to continue to your account' : 'Get started with Q-Ease today')}
          </p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}
            
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
            
            {!isLogin && !isAdminMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="orgCode">
                  Organization code <span className="optional-label">(optional)</span>
                </label>
                <input
                  type="text"
                  id="orgCode"
                  name="orgCode"
                  value={formData.orgCode}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="6-digit code"
                  maxLength="6"
                />
                <p className="input-hint">If joining an existing organization</p>
              </div>
            )}
            
            {!isLogin && isAdminMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="adminCode">
                  Admin verification code
                </label>
                <input
                  type="text"
                  id="adminCode"
                  name="adminCode"
                  className="form-input"
                  placeholder="Enter admin code"
                  required
                />
                <p className="input-hint">Contact your organization owner for admin code</p>
              </div>
            )}
            

            
            <button type="submit" className="submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-footer">
            {!isAdminMode && (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-auth-btn"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            )}
            {isAdminMode && isLogin && (
              <p className="admin-note">
                Admins can only login. Contact your organization owner to create an admin account.
              </p>
            )}
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