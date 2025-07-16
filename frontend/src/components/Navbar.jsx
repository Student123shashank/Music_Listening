import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { FaUser, FaMusic, FaSignOutAlt } from 'react-icons/fa'
import { FaHeart, FaList } from 'react-icons/fa'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowDropdown(false)
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <FaMusic className="text-pink-400 group-hover:text-pink-300 transition-colors text-xl" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
                Music Listening
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-6 relative">
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="font-medium group-hover:text-pink-200 transition-colors">
                    {user.username}
                  </span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FaUser className="mr-3 text-gray-500" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FaHeart className="mr-3 text-gray-500" />
                      <span>Favorites</span>
                    </Link>
                    <Link
                      to="/playlists"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FaList className="mr-3 text-gray-500" />
                      <span>Playlists</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FaSignOutAlt className="mr-3 text-gray-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar