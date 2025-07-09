import api from './api';

export const reviewService = {
  addReview: async (reviewData, token) => {
    return api.post('/api/v1/add', reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getSongReviews: async (songId) => {
    return api.get(`/api/v1/song/${songId}`);
  },

  getPlaylistReviews: async (playlistId) => {
    return api.get(`/api/v1/playlist/${playlistId}`);
  },

  getUserReviews: async (userId, token) => {
    return api.get(`/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  updateReview: async (reviewId, updates, token) => {
    return api.put(`/api/v1/update/${reviewId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  deleteReview: async (reviewId, token) => {
    return api.delete(`/api/v1/delete/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};