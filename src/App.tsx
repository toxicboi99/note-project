import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Notes } from './pages/Notes';
import { Unicode } from './pages/Unicode';
import { Tools } from './pages/Tools';
import { Contact } from './pages/Contact';
import { AuthPage } from './pages/Auth';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/unicode" element={<Unicode />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}