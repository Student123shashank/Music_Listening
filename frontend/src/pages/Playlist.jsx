import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { playlistService } from '../services/playlist';
import SongCard from '../components/SongCard';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerStore';

const PlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const { setCurrentSong, setQueue } = usePlayer();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await playlistService.getPlaylistById(id);
        setPlaylist(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setQueue(playlist.songs);
  };

  const handleToggleLike = async () => {
    try {
      await playlistService.toggleLike(playlist._id, user._id, token);
      setPlaylist(prev => ({
        ...prev,
        likes: prev.likes.includes(user._id) 
          ? prev.likes.filter(id => id !== user._id)
          : [...prev.likes, user._id]
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="bg-gray-100 p-6 rounded-lg">
            <img 
              src={playlist.coverImage || '/default-playlist.jpg'} 
              alt={playlist.title}
              className="w-full rounded mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-gray-600 mb-4">{playlist.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {playlist.songs.length} songs • {playlist.likes.length} likes
              </span>
              <button 
                onClick={handleToggleLike}
                className={`px-4 py-2 rounded ${playlist.likes.includes(user?._id) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                {playlist.likes.includes(user?._id) ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Songs</h2>
          <div className="grid grid-cols-1 gap-4">
            {playlist.songs.map(song => (
              <SongCard 
                key={song._id} 
                song={song} 
                onPlay={handlePlaySong}
                showFavourite={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;