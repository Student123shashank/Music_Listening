import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import AuthContext from '../../context/AuthContext'

const Playlists = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await api.get('/playlists')
        setPlaylists(data)
      } catch (err) {
        console.error('Failed to fetch playlists', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylists()
  }, [])

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return
    try {
      const { data } = await api.post('/playlists', { name: newPlaylistName })
      setPlaylists([...playlists, data])
      setNewPlaylistName('')
    } catch (err) {
      console.error('Failed to create playlist', err)
    }
  }

  const deletePlaylist = async (id) => {
    try {
      await api.delete(`/playlists/${id}`)
      setPlaylists(playlists.filter(playlist => playlist._id !== id))
    } catch (err) {
      console.error('Failed to delete playlist', err)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 mb-6">
        Your Playlists
      </h1>
      
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Playlist</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="My awesome playlist"
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
          />
          <button
            onClick={createPlaylist}
            disabled={!newPlaylistName.trim()}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
              newPlaylistName.trim() 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No playlists yet</h3>
          <p className="text-gray-500">Create your first playlist to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800 truncate">{playlist.name}</h3>
                  <button
                    onClick={() => deletePlaylist(playlist._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete playlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 mb-4">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </p>
                <Link
                  to={`/playlists/${playlist._id}`}
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  View Playlist
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Playlists