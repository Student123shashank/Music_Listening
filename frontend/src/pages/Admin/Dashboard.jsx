import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    api.get("/api/v1/all-users").then(res => setUsers(res.data.users));
    api.get("/api/v1/get-all-songs").then(res => setSongs(res.data.data));
    api.get("/api/v1/playlist/user/").then(res => setPlaylists(res.data)); // You may need to adjust this route for all playlists
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-4">Total Users: {users.length}</div>
      <div className="mb-4">Total Songs: {songs.length}</div>
      <div className="mb-4">Total Playlists: {playlists.length}</div>
      {/* Add more admin controls as needed */}
    </div>
  );
}