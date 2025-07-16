import { useState, useEffect, useContext } from 'react'
import SongCard from '../../components/SongCard'
import { getFavorites, removeFromFavorites } from '../../api/api'
import AuthContext from '../../context/AuthContext'

const Favorites = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await getFavorites()
        setSongs(data)
      } catch (err) {
        console.error('Failed to fetch favorites', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (songId) => {
    try {
      await removeFromFavorites(songId)
      setSongs(songs.filter(song => song._id !== songId))
    } catch (err) {
      console.error('Failed to remove favorite', err)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 h-12 w-12"></div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Your Favorite Songs
        </h1>
        {songs.length > 0 && (
          <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
          </span>
        )}
      </div>
      
      {songs.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-pink-100 to-violet-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No favorites yet</h3>
          <p className="text-gray-500">Start adding songs to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {songs.map((song) => (
            <SongCard 
              key={song._id} 
              song={song} 
              showRemove={true}
              onRemove={handleRemoveFavorite}
              showFavorite={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites