import api from './api';

export const signUp = async (formData) => {
  return api.post('/api/v1/sign-up', formData);
};

export const signIn = async (formData) => {
  return api.post('/api/v1/sign-in', formData);
};

export const getCurrentUser = async (token) => {
  return api.get('/api/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const uploadAvatar = async (formData, token) => {
  return api.post('/api/v1/upload-avatar', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateProfile = async (formData, token) => {
  return api.put('/api/v1/update-profile', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updatePassword = async (formData, token) => {
  return api.put('/api/v1/update-password', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Admin functions
export const getAllUsers = async (token) => {
  return api.get('/api/v1/all-users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateUser = async (id, formData, token) => {
  return api.put(`/api/v1/update-user/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteUser = async (id, token) => {
  return api.delete(`/api/v1/delete-user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default {
  signUp,
  signIn,
  getCurrentUser,
  uploadAvatar,
  updateProfile,
  updatePassword,
  getAllUsers,
  updateUser,
  deleteUser
};