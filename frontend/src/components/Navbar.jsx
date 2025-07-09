import { Link } from 'react-router-dom';
import { FiSearch, FiHome } from 'react-icons/fi';
import { useState } from 'react';
import UserProfileMenu from './UserProfileMenu';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-black text-white">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-2xl font-bold">
          <FiHome />
        </Link>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none w-64"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-white text-black px-4 py-1 rounded-full font-medium hover:bg-gray-200">
          Explore Premium
        </button>
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center"
          >
            <span className="text-sm">U</span>
          </button>
          {isProfileOpen && <UserProfileMenu />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;