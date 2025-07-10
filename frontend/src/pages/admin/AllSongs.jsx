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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Songs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Artist</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {songs.map((song) => (
              <tr key={song._id}>
                <td className="py-3 px-4">{song.name}</td>
                <td className="py-3 px-4">{song.artist}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(song._id)}
                    className="text-red-500 hover:text-red-700"
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
  )
}

export default AllSongs