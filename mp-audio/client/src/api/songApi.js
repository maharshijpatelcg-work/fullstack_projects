import api from './axiosInstance';

export const getAllSongs = async (params = {}) => {
  const { data } = await api.get('/songs', { params });
  return data;
};

export const getSongById = async (id) => {
  const { data } = await api.get(`/songs/${id}`);
  return data;
};

export const uploadSong = async (formData) => {
  const { data } = await api.post('/songs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const searchSongs = async (query) => {
  const { data } = await api.get('/songs', { params: { search: query } });
  return data;
};

export const getRecommendations = async () => {
  const { data } = await api.get('/songs/recommendations');
  return data;
};

export const deleteSong = async (id) => {
  const { data } = await api.delete(`/songs/${id}`);
  return data;
};
