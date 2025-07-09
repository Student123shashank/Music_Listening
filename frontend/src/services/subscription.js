import api from './api';

export const subscriptionService = {
  createSubscription: async (subscriptionData, token) => {
    return api.post('/api/v1/create', subscriptionData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getUserSubscription: async (userId, token) => {
    return api.get(`/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  cancelSubscription: async (subscriptionId, token) => {
    return api.put(`/api/v1/cancel/${subscriptionId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  checkSubscriptionStatus: async (userId, token) => {
    return api.get(`/api/v1/status/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getAllSubscriptions: async (token) => {
    return api.get('/api/v1/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}