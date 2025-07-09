import api from './api';

export const transactionService = {
  createTransaction: async (transactionData, token) => {
    return api.post('/api/v1/subscribe', transactionData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getUserTransactions: async (token) => {
    return api.get('/api/v1/my-transactions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};