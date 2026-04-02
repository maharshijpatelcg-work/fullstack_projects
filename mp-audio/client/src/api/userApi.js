import api from './axiosInstance';

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/users/profile', profileData);
  return data;
};

export const toggleLike = async (songId) => {
  const { data } = await api.post(`/users/like/${songId}`);
  return data;
};

export const getRecentlyPlayed = async () => {
  const { data } = await api.get('/users/recent');
  return data;
};

export const addToRecent = async (songId) => {
  const { data } = await api.post(`/users/recent/${songId}`);
  return data;
};
