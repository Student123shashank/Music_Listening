import api from './api';

export const playlistService = {
  createPlaylist: async (playlistData, token) => {
    return api.post('/api/v1/create', playlistData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getPlaylistById: async (id) => {
    return api.get(`/api/v1/${id}`);
  },

  getUserPlaylists: async (userId) => {
    return api.get(`/api/v1/user/${userId}`);
  },

  updatePlaylist: async (id, updates, token) => {
    return api.put(`/api/v1/update/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  deletePlaylist: async (id, token) => {
    return api.delete(`/api/v1/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  addSongToPlaylist: async (playlistId, songId, token) => {
    return api.put('/api/v1/add-song', { playlistId, songId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  removeSongFromPlaylist: async (playlistId, songId, token) => {
    return api.put('/api/v1/remove-song', { playlistId, songId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  toggleLike: async (playlistId, userId, token) => {
    return api.put('/api/v1/toggle-like', { playlistId, userId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};