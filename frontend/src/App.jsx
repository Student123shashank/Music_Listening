import { Routes, Route, useLocation } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import { useState, useEffect } from 'react'
import ProtectedRoute from './utils/ProtectedRoute'
import AdminRoute from './utils/AdminRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/user/Home'
import Profile from './pages/user/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import UploadSong from './pages/admin/UploadSong'
import AllSongs from './pages/admin/AllSongs'
import AllUsers from './pages/admin/AllUsers'
import api from './api/api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Favorites from './pages/user/Favorites'
import Playlists from './pages/user/Playlists'
import PlaylistDetail from './pages/user/PlaylistDetail'
import { AudioProvider } from './context/AudioContext'
import NowPlayingBar from './components/NowPlayingBar'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const { data } = await api.get('/auth/me')
          setUser(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <AudioProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pb-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlists/:id" element={<PlaylistDetail />} />    
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/upload" element={<UploadSong />} />
                  <Route path="/admin/songs" element={<AllSongs />} />
                  <Route path="/admin/users" element={<AllUsers />} />
                </Route>
              </Route>
            </Routes>
          </main>
          {!isAuthPage && <NowPlayingBar />}
          <Footer />
        </div>
      </AudioProvider>
    </AuthContext.Provider>
  )
}

export default App