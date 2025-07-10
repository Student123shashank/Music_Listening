import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/upload"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Upload Song</h2>
          <p className="text-gray-600">Upload new songs to the platform</p>
        </Link>
        <Link
          to="/admin/songs"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">All Songs</h2>
          <p className="text-gray-600">View and manage all songs</p>
        </Link>
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">All Users</h2>
          <p className="text-gray-600">View and manage all users</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard