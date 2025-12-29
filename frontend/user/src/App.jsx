import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Organizations from './pages/Organizations';
import MyTokens from './pages/MyTokens';
import Login from './pages/Login';
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App