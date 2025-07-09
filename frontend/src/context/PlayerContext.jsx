import { createContext, useContext, useState, useEffect } from 'react'
import { playSong as playSongService } from '../services/songs'

const PlayerContext = createContext()

export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [progress, setProgress] = useState(0)
  
  const currentSong = queue[currentIndex]

  const playSong = (song, newQueue = []) => {
    if (newQueue.length > 0) {
      setQueue(newQueue)
      setCurrentIndex(newQueue.findIndex(s => s._id === song._id))
    } else if (!queue.some(s => s._id === song._id)) {
      setQueue([...queue, song])
      setCurrentIndex(queue.length)
    } else {
      setCurrentIndex(queue.findIndex(s => s._id === song._id))
    }
    setIsPlaying(true)
    playSongService(song._id)
  }

  const pauseSong = () => {
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1)
      playSongService(queue[currentIndex + 1]._id)
    } else {
      setCurrentIndex(0)
      playSongService(queue[0]._id)
    }
  }

  const prevSong = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      playSongService(queue[currentIndex - 1]._id)
    }
  }

  return (
    <PlayerContext.Provider value={{
      currentSong,
      queue,
      currentIndex,
      isPlaying,
      volume,
      progress,
      playSong,
      pauseSong,
      togglePlay,
      nextSong,
      prevSong,
      setVolume,
      setProgress
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)