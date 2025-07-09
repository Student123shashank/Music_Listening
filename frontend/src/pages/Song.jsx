import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { songService } from '../services/songs';
import SongCard from '../components/SongCard';
import ReviewSection from '../components/ReviewSection';
import { usePlayer } from '../context/PlayerStore';

const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setCurrentSong, setQueue } = usePlayer();

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await songService.getSongById(id);
        setSong(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load song');
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  const handlePlay = (song) => {
    setCurrentSong(song);
    setQueue([song]);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!song) return <div className="text-center py-8">Song not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <SongCard song={song} onPlay={handlePlay} showPlayButton={false} />
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Details</h3>
            <p><span className="font-semibold">Artist:</span> {song.artist}</p>
            <p><span className="font-semibold">Album:</span> {song.album}</p>
            <p><span className="font-semibold">Genre:</span> {song.genre}</p>
            <p><span className="font-semibold">Release Date:</span> {new Date(song.releaseDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Plays:</span> {song.plays || 0}</p>
          </div>
        </div>
        <div className="md:w-2/3">
          <ReviewSection type="song" id={id} />
        </div>
      </div>
    </div>
  );
};

export default SongPage;