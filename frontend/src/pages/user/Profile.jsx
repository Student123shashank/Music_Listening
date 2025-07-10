import { useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const Profile = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.username}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Username</h3>
            <p>{user?.username}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Email</h3>
            <p>{user?.email}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Role</h3>
            <p className="capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile