import { useState, useEffect, useRef, useContext } from 'react'
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaList, FaTimes } from 'react-icons/fa'
import { 
  addToFavorites, 
  removeFromFavorites, 
  checkFavorite, 
  getPlaylists, 
  addToPlaylist 
} from '../api/api'
import AuthContext from '../context/AuthContext'

const SongCard = ({ song, showRemove = false, onRemove, showFavorite = true }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  const audioRef = useRef(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    audioRef.current = new Audio(`http://localhost:5000${song.audioUrl}`)
    audioRef.current.preload = 'metadata'

    const audio = audioRef.current
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleError = (e) => {
      console.error('Audio error:', e)
      setError('Failed to play audio')
      setIsPlaying(false)
      setIsLoading(false)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    const checkFavoriteStatus = async () => {
      if (!user || !showFavorite) return
      try {
        const { data } = await checkFavorite(song._id)
        setIsFavorite(data.isFavorite)
      } catch (err) {
        console.error('Failed to check favorite status', err)
      }
    }
    checkFavoriteStatus()

    return () => {
      audio.pause()
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.src = ''
    }
  }, [song.audioUrl, song._id, user, showFavorite])

  const togglePlay = async () => {
    if (isLoading) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        setIsLoading(true)
        setError(null)
        await audioRef.current.play()
      }
    } catch (err) {
      console.error('Playback error:', err)
      setError('Failed to play audio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) return
    try {
      if (isFavorite) {
        await removeFromFavorites(song._id)
      } else {
        await addToFavorites(song._id)
      }
      setIsFavorite(!isFavorite)
    } catch (err) {
      console.error('Failed to toggle favorite', err)
    }
  }

  const fetchPlaylists = async () => {
    try {
      const { data } = await getPlaylists()
      setPlaylists(data)
    } catch (err) {
      console.error('Failed to fetch playlists', err)
    }
  }

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) return
    try {
      await addToPlaylist(selectedPlaylist, song._id)
      setShowPlaylistModal(false)
      setSelectedPlaylist('')
    } catch (err) {
      console.error('Failed to add to playlist', err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {user && showFavorite && (
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-20 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-pink-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-pink-500 text-lg transition-colors" />
          )}
        </button>
      )}
      
      {showRemove && (
        <button
          onClick={() => onRemove(song._id)}
          className="absolute top-3 left-3 z-20 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
          aria-label="Remove song"
        >
          <FaTimes className="text-sm" />
        </button>
      )}
      
      <div className="relative">
        <img 
          src={song.imageUrl} 
          alt={song.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isLoading ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'
            } text-white shadow-lg transition-all`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <FaPause className="text-sm" />
            ) : (
              <FaPlay className="text-sm ml-0.5" />
            )}
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 truncate">{song.name}</h3>
        <p className="text-gray-600 text-sm">{song.artist}</p>
        
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}

        <div className="flex mt-4 space-x-2">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-full ${
              isLoading ? 'bg-gray-300' : 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600'
            } text-white shadow-md transition-all`}
          >
            {isLoading ? (
              'Loading...'
            ) : isPlaying ? (
              <>
                <FaPause className="mr-2 text-sm" />
                Pause
              </>
            ) : (
              <>
                <FaPlay className="mr-2 text-sm" />
                Play
              </>
            )}
          </button>
          
          {user && (
            <button
              onClick={() => {
                fetchPlaylists()
                setShowPlaylistModal(true)
              }}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-full shadow-md transition-all"
              aria-label="Add to playlist"
            >
              <FaList className="text-sm" />
            </button>
          )}
        </div>
      </div>

      
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add to Playlist</h3>
              <button
                onClick={() => {
                  setShowPlaylistModal(false)
                  setSelectedPlaylist('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <select
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            >
              <option value="">Select a playlist</option>
              {playlists.map(playlist => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPlaylistModal(false)
                  setSelectedPlaylist('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToPlaylist}
                disabled={!selectedPlaylist}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedPlaylist 
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600' 
                    : 'bg-gray-300'
                } transition-all`}
              >
                Add to Playlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SongCard