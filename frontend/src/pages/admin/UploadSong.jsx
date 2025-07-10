import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import { toast } from 'react-toastify'

const UploadSong = () => {
  const [name, setName] = useState('')
  const [artist, setArtist] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!audioFile) {
      toast.error('Please select an audio file')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('artist', artist)
    formData.append('imageUrl', imageUrl)
    formData.append('audio', audioFile)

    try {
      setIsUploading(true)
      await api.post('/songs/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Song uploaded successfully')
      navigate('/admin/songs')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload song')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Song</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Song Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
            Artist
          </label>
          <input
            id="artist"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
            Audio File
          </label>
          <input
            id="audio"
            type="file"
            accept="audio/*"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isUploading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
    </div>
  )
}

export default UploadSong