import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Organizations from './pages/Organizations';
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
            {/* User Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Home />
                </main>
              </>
            } />
            <Route path="/organizations" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Organizations />
                </main>
              </>
            } />
            <Route path="/my-tokens" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <MyTokens />
                </main>
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Login />
                </main>
              </>
            } />
          
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['manager', 'owner']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['manager', 'owner']}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/queues" element={
              <ProtectedRoute allowedRoles={['manager', 'owner']}>
                <AdminLayout>
                  <AdminQueues />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRoles={['manager', 'owner']}>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App