import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from './icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/', icon: Icons.Home, label: 'Home' },
  { path: '/notes', icon: Icons.FileText, label: 'Notes' },
  { path: '/unicode', icon: Icons.Code, label: 'Unicode' },
  { path: '/tools', icon: Icons.Tools, label: 'Tools' },
  { path: '/contact', icon: Icons.Mail, label: 'Contact' },
];

export function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Icons.Menu className="h-6 w-6 text-gray-700" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Icons.LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}