import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Music App</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:inline">Welcome, {user.username}</span>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-x-2">
              <a href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                Login
              </a>
              <a href="/signup" className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;