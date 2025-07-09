import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageSong = () => {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token"); // Assuming token stored in localStorage

  // Fetch all songs
  const fetchSongs = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/get-all-songs");
      setSongs(res.data.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Delete single song
  const handleDelete = async (songId) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    try {
      await axios.delete("http://localhost:1000/api/v1/delete-song", {
        headers: {
          Authorization: `Bearer ${token}`,
          songid: songId,
        },
      });
      fetchSongs();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Delete all songs
  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL songs? This action is irreversible.")) return;
    try {
      await axios.delete("http://localhost:1000/api/v1/delete-all-songs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSongs();
    } catch (error) {
      console.error("Delete all failed:", error);
    }
  };

  // Start editing
  const handleEdit = (song) => {
    setEditingSong(song._id);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      duration: song.duration,
    });
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save updated song
  const handleSave = async () => {
    try {
      await axios.put("http://localhost:1000/api/v1/update-song", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          songid: editingSong,
        },
      });
      setEditingSong(null);
      fetchSongs();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Songs</h2>

      <button
        onClick={handleDeleteAll}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Delete All Songs
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Artist</th>
              <th className="px-3 py-2">Album</th>
              <th className="px-3 py-2">Genre</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song._id} className="border-t">
                {editingSong === song._id ? (
                  <>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="album"
                        value={formData.album}
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="border rounded px-2"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSong(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2">{song.title}</td>
                    <td className="px-3 py-2">{song.artist}</td>
                    <td className="px-3 py-2">{song.album || "-"}</td>
                    <td className="px-3 py-2">{song.genre}</td>
                    <td className="px-3 py-2">{song.duration}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleEdit(song)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSong;
