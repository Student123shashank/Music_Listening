import api from './api';

export const favouritesService = {
  addToFavourites: async (songId, token) => {
    return api.put('/api/v1/add-song-to-favourites', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        songid: songId,
        id: localStorage.getItem('userId')
      }
    });
  },

  removeFromFavourites: async (songId, token) => {
    return api.put('/api/v1/remove-song-from-favourites', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        songid: songId,
        id: localStorage.getItem('userId')
      }
    });
  },

  getFavourites: async (token) => {
    return api.get('/api/v1/get-favourite-songs', {
      headers: {
        Authorization: `Bearer ${token}`,
        id: localStorage.getItem('userId')
      }
    });
  }
};