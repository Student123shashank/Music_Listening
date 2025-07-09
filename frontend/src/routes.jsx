import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/MainContainer'
import Loading from './components/common/Loading'


const Home = lazy(() => import('./components/sections/Home'))
const Music = lazy(() => import('./components/sections/Music'))
const AllSongs = lazy(() => import('./components/sections/AllSongs'))
const Library = lazy(() => import('./components/sections/Library'))
const Favorites = lazy(() => import('./components/sections/Favorites'))
const History = lazy(() => import('./components/sections/History'))
const Recent = lazy(() => import('./components/sections/Recent'))
const Playlist = lazy(() => import('./components/sections/Playlist'))
const Search = lazy(() => import('./components/sections/Search'))
const Premium = lazy(() => import('./components/sections/Premium'))
const Profile = lazy(() => import('./components/sections/Profile'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Register = lazy(() => import('./pages/Auth/Register'))
const Error = lazy(() => import('./pages/Error'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
          <Route path="/all" element={<ProtectedRoute><AllSongs /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/recent" element={<ProtectedRoute><Recent /></ProtectedRoute>} />
          <Route path="/playlist/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
        
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes