import { useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const Profile = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-8">
        Your Profile
      </h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md">
        <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Username</h3>
            <p className="text-lg font-medium">{user?.username}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</h3>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account Type</h3>
            <div className="flex items-center">
              <span className="text-lg font-medium capitalize">{user?.role}</span>
              {user?.role === 'admin' && (
                <span className="ml-2 bg-pink-100 text-pink-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile