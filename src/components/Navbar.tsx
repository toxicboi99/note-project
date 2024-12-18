import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, FileText, Code, Wrench, Mail, LogIn, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/unicode', icon: Code, label: 'Unicode' },
  { path: '/tools', icon: Wrench, label: 'Tools' },
  { path: '/contact', icon: Mail, label: 'Contact' },
];

export function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center ml-4 sm:ml-0">
              <Home className="h-6 w-6" />
              <span className="ml-2">LearnHub</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:ml-6 sm:space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col space-y-2 px-4 pb-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600">
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
