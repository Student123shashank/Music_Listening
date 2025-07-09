import api from './api';

export const songService = {
  // Song Management
  addSongs: async (songs, token, userId) => {
    return api.post('/api/v1/add-song', songs, {
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId
      }
    });
  },

  updateSong: async (songId, updates, token) => {
    return api.put('/api/v1/update-song', updates, {
      headers: {
        Authorization: `Bearer ${token}`,
        songid: songId
      }
    });
  },

  deleteSong: async (songId, token) => {
    return api.delete('/api/v1/delete-song', {
      headers: {
        Authorization: `Bearer ${token}`,
        songid: songId
      }
    });
  },

  deleteAllSongs: async (token) => {
    return api.delete('/api/v1/delete-all-songs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Song Fetching
  getAllSongs: async () => {
    return api.get('/api/v1/get-all-songs');
  },

  getRecentSongs: async () => {
    return api.get('/api/v1/get-recent-songs');
  },

  getSongById: async (id) => {
    return api.get(`/api/v1/get-song-by-id/${id}`);
  },

  searchSongs: async (query) => {
    return api.get(`/api/v1/search?query=${query}`);
  },

  getTotalSongs: async () => {
    return api.get('/api/v1/total-songs');
  },

  // Play History
  recordPlay: async (songId, token, userId) => {
    return api.post(`/api/v1/play/${songId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId
      }
    });
  },

  getPlayHistory: async (token, userId) => {
    return api.get('/api/v1/history', {
      headers: {
        Authorization: `Bearer ${token}`,
        id: userId
      }
    });
  }
};