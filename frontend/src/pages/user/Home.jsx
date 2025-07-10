import { useState, useEffect, useContext } from 'react'
import SongCard from '../../components/SongCard'
import api from '../../api/api'
import AuthContext from '../../context/AuthContext'

const Home = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await api.get('/songs')
        setSongs(data)
      } catch (err) {
        console.error('Failed to fetch songs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome {user?.username}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  )
}

export default Home