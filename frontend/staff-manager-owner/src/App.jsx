import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import MyTokens from './pages/MyTokens';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminQueues from './pages/admin/Queues';
import AdminAnalytics from './pages/admin/Analytics';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Staff/Manager/Owner Routes - Role-based access */}
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'owner']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'owner']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/queues" element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'owner']}>
                <AdminLayout>
                  <AdminQueues />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['manager', 'owner']}>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/my-tokens" element={
              <ProtectedRoute allowedRoles={['staff', 'manager', 'owner']}>
                <AdminLayout>
                  <MyTokens />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App