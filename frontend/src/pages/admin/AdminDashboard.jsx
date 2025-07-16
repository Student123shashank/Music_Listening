import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/upload"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Upload Song</h2>
            </div>
            <p className="text-gray-600">Upload new songs to the platform</p>
          </Link>

          <Link
            to="/admin/songs"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-indigo-100 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">All Songs</h2>
            </div>
            <p className="text-gray-600">View and manage all songs</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-100 group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">All Users</h2>
            </div>
            <p className="text-gray-600">View and manage all users</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard