import { useState, useEffect } from 'react'
import api from '../../api/api'
import { toast } from 'react-toastify'

const AllSongs = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await api.get('/songs')
        setSongs(data)
      } catch (err) {
        toast.error('Failed to fetch songs')
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/songs/${id}`)
      setSongs(songs.filter(song => song._id !== id))
      toast.success('Song deleted successfully')
    } catch (err) {
      toast.error('Failed to delete song')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-blue-400 h-12 w-12"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">All Songs</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artist
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {songs.map((song) => (
                  <tr key={song._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{song.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{song.artist}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllSongs