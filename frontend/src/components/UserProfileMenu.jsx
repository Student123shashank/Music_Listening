import { Link } from 'react-router-dom';

const UserProfileMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
      {isLoggedIn ? (
        <>
          <Link to="/premium" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
            Upgrade to Premium
          </Link>
          <Link to="/settings" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
            Settings
          </Link>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
            Login
          </Link>
          <Link to="/signup" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default UserProfileMenu;