import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const addToFavorites = (songId) => api.post(`/favorites/${songId}`)
export const removeFromFavorites = (songId) => api.delete(`/favorites/${songId}`)
export const checkFavorite = (songId) => api.get(`/favorites/check/${songId}`)
export const getFavorites = () => api.get('/favorites')


export const createPlaylist = (name) => api.post('/playlists', { name })
export const getPlaylists = () => api.get('/playlists')
export const getPlaylist = (id) => api.get(`/playlists/${id}`)
export const addToPlaylist = (playlistId, songId) => api.put(`/playlists/${playlistId}/add`, { songId })
export const removeFromPlaylist = (playlistId, songId) => api.put(`/playlists/${playlistId}/remove`, { songId })
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`)

export default api