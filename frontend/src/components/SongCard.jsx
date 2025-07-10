import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'

const SongCard = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

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

    return () => {
      
      audio.pause()
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.src = ''
    }
  }, [song.audioUrl])

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={song.imageUrl} 
        alt={song.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{song.name}</h3>
        <p className="text-gray-600">{song.artist}</p>
        
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`mt-2 flex items-center justify-center w-full px-4 py-2 rounded ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading ? (
            'Loading...'
          ) : isPlaying ? (
            <>
              <FaPause className="mr-2" />
              Pause
            </>
          ) : (
            <>
              <FaPlay className="mr-2" />
              Play
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SongCard