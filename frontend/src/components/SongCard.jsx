import { useState, useEffect, useContext } from 'react'
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaList, FaTimes, FaEllipsisH } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { 
  addToFavorites, 
  removeFromFavorites, 
  checkFavorite, 
  getPlaylists, 
  addToPlaylist 
} from '../api/api'
import AuthContext from '../context/AuthContext'
import { useAudio } from '../context/AudioContext'

const SongCard = ({ song, showRemove = false, onRemove, showFavorite = true }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playSong
  } = useAudio()
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
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
  }, [song._id, user, showFavorite])

  const handlePlay = () => {
    playSong(song)
  }

  const formatTime = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
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

  const isCurrentSong = currentSong?._id === song._id

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden relative transition-all duration-300 hover:shadow-2xl"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {user && showFavorite && (
        <motion.button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-20 p-2 bg-black bg-opacity-60 rounded-full shadow-md hover:bg-opacity-80 transition-all"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isFavorite ? (
            <FaHeart className="text-pink-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-300 hover:text-pink-500 text-lg transition-colors" />
          )}
        </motion.button>
      )}
      
      {showRemove && (
        <motion.button
          onClick={() => onRemove(song._id)}
          className="absolute top-3 left-3 z-20 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
          aria-label="Remove song"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes className="text-sm" />
        </motion.button>
      )}
      
      <div className="relative">
        <img 
          src={song.imageUrl} 
          alt={song.name} 
          className="w-full h-48 object-cover"
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={handlePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCurrentSong && isPlaying ? 'bg-pink-600' : 'bg-pink-500 hover:bg-pink-600'
            } text-white shadow-xl transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCurrentSong && isPlaying ? (
              <FaPause className="text-base" />
            ) : (
              <FaPlay className="text-base ml-1" />
            )}
          </motion.button>
        </motion.div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-white truncate">{song.name}</h3>
            <p className="text-gray-400 text-sm">{song.artist}</p>
          </div>
          <button className="text-gray-400 hover:text-white ml-2">
            <FaEllipsisH />
          </button>
        </div>
        
        {isCurrentSong && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
              <motion.div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(currentTime / duration) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="flex mt-4 space-x-2">
          <motion.button
            onClick={handlePlay}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg ${
              isCurrentSong && isPlaying 
                ? 'bg-gradient-to-r from-pink-600 to-purple-600' 
                : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
            } text-white shadow-lg transition-all`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCurrentSong && isPlaying ? (
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
          </motion.button>
          
          {user && (
            <motion.button
              onClick={() => {
                fetchPlaylists()
                setShowPlaylistModal(true)
              }}
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg shadow-lg transition-all"
              aria-label="Add to playlist"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaList className="text-sm" />
            </motion.button>
          )}
        </div>
      </div>

      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <motion.div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
              <button
                onClick={() => {
                  setShowPlaylistModal(false)
                  setSelectedPlaylist('')
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <select
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            >
              <option value="" className="bg-gray-800">Select a playlist</option>
              {playlists.map(playlist => (
                <option key={playlist._id} value={playlist._id} className="bg-gray-800">
                  {playlist.name}
                </option>
              ))}
            </select>
            
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                onClick={() => {
                  setShowPlaylistModal(false)
                  setSelectedPlaylist('')
                }}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleAddToPlaylist}
                disabled={!selectedPlaylist}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedPlaylist 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                    : 'bg-gray-600 cursor-not-allowed'
                } transition-all`}
                whileHover={{ scale: selectedPlaylist ? 1.03 : 1 }}
                whileTap={{ scale: selectedPlaylist ? 0.97 : 1 }}
              >
                Add to Playlist
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default SongCard