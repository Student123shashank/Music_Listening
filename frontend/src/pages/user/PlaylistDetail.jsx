import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import SongCard from '../../components/SongCard'
import { getPlaylist, removeFromPlaylist } from '../../api/api'
import AuthContext from '../../context/AuthContext'

const PlaylistDetail = () => {
  const { id } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data } = await getPlaylist(id)
        setPlaylist(data)
      } catch (err) {
        console.error('Failed to fetch playlist', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylist()
  }, [id])

  const handleRemoveSong = async (songId) => {
    try {
      const { data } = await removeFromPlaylist(id, songId)
      setPlaylist(data)
    } catch (err) {
      console.error('Failed to remove song', err)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  if (!playlist) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Playlist not found</h2>
        <Link 
          to="/playlists" 
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
        >
          Back to Playlists
        </Link>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            {playlist.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
        <Link 
          to="/playlists" 
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Playlists
        </Link>
      </div>
      
      {playlist.songs.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">This playlist is empty</h3>
          <p className="text-gray-500">Add some songs to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlist.songs.map((song) => (
            <SongCard 
              key={song._id} 
              song={song} 
              showRemove={true}
              onRemove={handleRemoveSong}
              showFavorite={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PlaylistDetail