import React, { useState, useEffect } from 'react';
import { songService } from '../services/songs';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerStore';

const Home = () => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setCurrentSong, setQueue } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const [recentResponse, allResponse] = await Promise.all([
          songService.getRecentSongs(),
          songService.getAllSongs()
        ]);
        setRecentSongs(recentResponse.data.data);
        setAllSongs(allResponse.data.data);
      } catch (err) {
        setError('Failed to load songs');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (song) => {
    setCurrentSong(song);
    setQueue([song]);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentSongs.map(song => (
            <SongCard key={song._id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">All Songs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allSongs.map(song => (
            <SongCard key={song._id} song={song} onPlay={handlePlay} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;