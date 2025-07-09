import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-gray-100 text-gray-800 h-full flex-shrink-0">
      <nav className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-200">
              Home
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/library" className="block py-2 px-4 rounded hover:bg-gray-200">
                  My Library
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Subscription
                </Link>
              </li>
              <li>
                <Link to="/profile" className="block py-2 px-4 rounded hover:bg-gray-200">
                  My Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        {user?.role === 'admin' && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Admin</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/add-song" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Add Song
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-song" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Manage Song
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-review" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Manage Review
                </Link>
              </li>
              <li>
                <Link to="/admin/add-song" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Manage User
                </Link>
              </li>
              <li>
                <Link to="/admin/add-song" className="block py-2 px-4 rounded hover:bg-gray-200">
                  Manage Subscription
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;