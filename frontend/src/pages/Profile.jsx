import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getCurrentUser, 
  updateProfile, 
  updatePassword, 
  uploadAvatar 
} from '../services/auth';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData, localStorage.getItem('token'));
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(passwordData, localStorage.getItem('token'));
      setMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      await uploadAvatar(formData, localStorage.getItem('token'));
      setMessage('Avatar updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Avatar upload failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <img 
                  src={user?.avatar || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <form onSubmit={handleAvatarUpload} className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="mb-2 w-full"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Update Avatar
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Update Profile
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Change Password
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
              <button
                onClick={logout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;