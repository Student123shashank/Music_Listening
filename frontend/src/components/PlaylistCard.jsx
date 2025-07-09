import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/playlist/${playlist._id}`}>
        <img 
          src={playlist.coverImage || '/default-playlist.jpg'} 
          alt={playlist.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{playlist.title}</h3>
          <p className="text-gray-600 text-sm truncate">{playlist.description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {playlist.songs?.length || 0} songs
            </span>
            <span className="text-xs text-gray-500">
              {playlist.likes?.length || 0} likes
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PlaylistCard;