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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Upload Song</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Song Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter song name"
              />
            </div>
            
            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
                Artist
              </label>
              <input
                id="artist"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            
            <div>
              <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1">
                Audio File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="audio"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="audio"
                        name="audio"
                        type="file"
                        accept="audio/*"
                        required
                        className="sr-only"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP3, WAV up to 10MB</p>
                </div>
              </div>
              {audioFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {audioFile.name}
                </p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : 'Upload Song'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadSong