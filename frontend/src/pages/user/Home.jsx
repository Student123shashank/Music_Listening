import { useState, useEffect, useContext } from 'react'
import SongCard from '../../components/SongCard'
import api from '../../api/api'
import AuthContext from '../../context/AuthContext'
import { useAudio } from '../../context/AudioContext'

const Home = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const { updateSongList } = useAudio()

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await api.get('/songs')
        setSongs(data)
        updateSongList(data)
      } catch (err) {
        console.error('Failed to fetch songs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [updateSongList])

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 h-12 w-12"></div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-2">
          Welcome back, {user?.username}
        </h1>
        <p className="text-gray-500">Discover your next favorite song</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  )
}

export default Home