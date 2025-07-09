import React from 'react';
import { usePlayer } from '../context/PlayerStore';

const PlayerBar = () => {
  const { currentSong } = usePlayer();

  return (
    <footer className="bg-gray-800 text-white p-4 border-t border-gray-700">
      <div className="container mx-auto flex items-center">
        {currentSong ? (
          <>
            <div className="flex-shrink-0 mr-4">
              <img 
                src={currentSong.coverImage || '/default-cover.jpg'} 
                alt={currentSong.title}
                className="w-12 h-12 rounded"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{currentSong.title}</h3>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
            <div className="flex-shrink-0">
              <audio controls className="ml-4">
                <source src={currentSong.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </>
        ) : (
          <div className="text-center w-full text-gray-400">
            No song selected
          </div>
        )}
      </div>
    </footer>
  );
};

export default PlayerBar;