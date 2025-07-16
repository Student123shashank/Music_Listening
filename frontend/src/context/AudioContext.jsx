import { createContext, useContext, useState, useRef, useEffect } from 'react'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [songList, setSongList] = useState([])
  const audioRef = useRef(new Audio())
  
  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volume
    
    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      playNextSong()
    }
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('durationchange', updateDuration)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('durationchange', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const playSong = (song) => {
    if (!song) return
    
    if (currentSong?._id === song._id) {
      togglePlay()
    } else {
      audioRef.current.pause()
      audioRef.current.src = `http://localhost:5000${song.audioUrl}`
      audioRef.current.play()
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const playNextSong = () => {
    if (!currentSong || songList.length === 0) return
    
    const currentIndex = songList.findIndex(song => song._id === currentSong._id)
    const nextIndex = (currentIndex + 1) % songList.length
    playSong(songList[nextIndex])
  }

  const playPreviousSong = () => {
    if (!currentSong || songList.length === 0) return
    
    const currentIndex = songList.findIndex(song => song._id === currentSong._id)
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length
    playSong(songList[prevIndex])
  }

  const togglePlay = () => {
    if (!currentSong) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time) => {
    if (!currentSong) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    audioRef.current.volume = newVolume
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume
    } else {
      audioRef.current.volume = 0
    }
    setIsMuted(!isMuted)
  }

  const updateSongList = (songs) => {
    setSongList(songs)
  }

  return (
    <AudioContext.Provider value={{
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playSong,
      togglePlay,
      seekTo,
      handleVolumeChange,
      toggleMute,
      playNextSong,
      playPreviousSong,
      updateSongList
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => useContext(AudioContext)