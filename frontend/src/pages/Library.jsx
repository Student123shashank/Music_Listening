import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { playlistService } from '../services/playlist';
import { favouritesService } from '../services/favourites';
import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';

const Library = () => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistsResponse, favouritesResponse] = await Promise.all([
          playlistService.getUserPlaylists(user._id),
          favouritesService.getFavourites(token)
        ]);
        setUserPlaylists(playlistsResponse.data);
        setFavouriteSongs(favouritesResponse.data.data);
      } catch (error) {
        console.error('Error fetching library data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchData();
    }
  }, [user, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userPlaylists.map(playlist => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Favourite Songs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favouriteSongs.map(song => (
            <SongCard key={song._id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Library;