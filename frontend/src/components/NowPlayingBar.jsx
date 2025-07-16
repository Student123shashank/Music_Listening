import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepBackward, FaStepForward } from 'react-icons/fa'
import { useAudio } from '../context/AudioContext'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const NowPlayingBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seekTo,
    handleVolumeChange,
    toggleMute,
    playNextSong,
    playPreviousSong
  } = useAudio()

  const [isVisible, setIsVisible] = useState(true)
  const [lastInteraction, setLastInteraction] = useState(Date.now())

  useEffect(() => {
    const handleInteraction = () => {
      setIsVisible(true)
      setLastInteraction(Date.now())
    }

    const hideBar = () => {
      if (Date.now() - lastInteraction > 3000) {
        setIsVisible(false)
      }
    }

    window.addEventListener('mousemove', handleInteraction)
    const interval = setInterval(hideBar, 1000)

    return () => {
      window.removeEventListener('mousemove', handleInteraction)
      clearInterval(interval)
    }
  }, [lastInteraction])

  const formatTime = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (!currentSong) return null

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 shadow-2xl border-t border-gray-700 p-3 z-50"
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="container mx-auto flex items-center">
        {/* Song Info */}
        <div className="flex items-center w-1/4">
          <motion.img 
            src={currentSong.imageUrl} 
            alt={currentSong.name} 
            className="w-14 h-14 rounded-md object-cover mr-4 shadow-lg"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          />
          <div className="overflow-hidden">
            <motion.h4 
              className="font-bold text-white text-sm truncate"
              animate={{ x: [0, -50, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {currentSong.name}
            </motion.h4>
            <p className="text-gray-300 text-xs">{currentSong.artist}</p>
          </div>
        </div>
        
        {/* Player Controls */}
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={playPreviousSong}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaStepBackward />
            </button>
            
            <motion.button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:bg-pink-500 transition-all"
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-1" />}
            </motion.button>
            
            <button 
              onClick={playNextSong}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <FaStepForward />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
            />
            
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Volume Controls */}
        <div className="w-1/4 flex justify-end items-center gap-3">
          <button 
            onClick={toggleMute}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default NowPlayingBar