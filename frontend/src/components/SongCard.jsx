import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { songService } from '../services/songs';
import { usePlayer } from '../context/PlayerStore';

const SongCard = ({ song, onPlay, showPlayButton = true }) => {
  const { token, user } = useAuth();
  const { setCurrentSong, setQueue } = usePlayer();

  const handlePlay = async () => {
    try {
      await songService.recordPlay(song._id, token, user._id);
      if (onPlay) {
        onPlay(song);
      } else {
        setCurrentSong(song);
        setQueue([song]);
      }
    } catch (error) {
      console.error('Error recording play:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/song/${song._id}`}>
        <img 
          src={song.coverImage || '/default-cover.jpg'} 
          alt={song.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/song/${song._id}`}>
          <h3 className="font-bold text-lg truncate hover:text-blue-500">{song.title}</h3>
          <p className="text-gray-600">{song.artist}</p>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">{song.genre}</span>
          <span className="text-sm text-gray-500">
            {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
          </span>
        </div>
        {showPlayButton && (
          <button 
            onClick={handlePlay}
            className="mt-2 w-full bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 text-sm"
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCard;