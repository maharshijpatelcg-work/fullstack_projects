import api from './axiosInstance';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const signup = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
