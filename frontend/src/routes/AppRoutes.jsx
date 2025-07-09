import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Song from "../pages/Song";
import Playlist from "../pages/Playlist";
import Library from "../pages/Library";
import Subscription from "../pages/Subscription";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Profile from "../pages/Profile";
import ProtectedRoute from "../utils/protectedRoute";
import AddSong from "../pages/Admin/AddSongs";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageSong from "../pages/Admin/ManageSongs"
import ManageReviews from "../pages/Admin/ManageReviews"


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/song/:id" element={<Song />} />
      <Route path="/playlist/:id" element={<Playlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/admin/add-song" element={<ProtectedRoute adminOnly><AddSong /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/manage-song" element={<ProtectedRoute adminOnly><ManageSong /></ProtectedRoute>} />
      <Route path="/admin/manage-review" element={<ProtectedRoute adminOnly><ManageReviews /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
