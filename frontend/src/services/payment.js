import api from './api';

export const paymentService = {
  createRazorpayOrder: async (amount, token) => {
    return api.post('/api/v1/create-order', { amount }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  capturePayment: async (paymentData, token) => {
    return api.post('/api/v1/capture-payment', paymentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};