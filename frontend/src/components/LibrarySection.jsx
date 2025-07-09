import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const LibrarySection = () => {
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "My playlist 1", description: "Playlist: Chainlink Pandey" },
    { id: 2, name: "My Playlist #2", description: "Playlist: Chainlink Pandey" },
    { id: 3, name: "90s HITS ITOP 80B SONGS", description: "Playlist: Fits US" },
    { id: 4, name: "Trending", description: "D paylists" }
  ]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleAddPlaylist = () => {
    if (newPlaylistName.trim()) {
      setPlaylists([...playlists, {
        id: Date.now(),
        name: newPlaylistName,
        description: "New playlist"
      }]);
      setNewPlaylistName('');
    }
  };

  const handleDeletePlaylist = (id) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Library</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="bg-gray-700 rounded px-2 py-1 text-sm"
          />
          <button 
            onClick={handleAddPlaylist}
            className="bg-green-500 p-1 rounded-full hover:bg-green-600"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      {playlists.map(playlist => (
        <div key={playlist.id} className="group flex justify-between items-center p-2 hover:bg-gray-800 rounded">
          <div>
            <h3 className="font-medium">{playlist.name}</h3>
            <p className="text-gray-400 text-sm">{playlist.description}</p>
          </div>
          <button 
            onClick={() => handleDeletePlaylist(playlist.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default LibrarySection;