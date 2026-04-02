import api from './axiosInstance';

export const getMyPlaylists = async () => {
  const { data } = await api.get('/playlists');
  return data;
};

export const getPlaylistById = async (id) => {
  const { data } = await api.get(`/playlists/${id}`);
  return data;
};

export const createPlaylist = async (playlistData) => {
  const { data } = await api.post('/playlists', playlistData);
  return data;
};

export const updatePlaylist = async (id, playlistData) => {
  const { data } = await api.put(`/playlists/${id}`, playlistData);
  return data;
};

export const addRemoveSong = async (id, songId, action) => {
  const { data } = await api.put(`/playlists/${id}/songs`, { songId, action });
  return data;
};

export const deletePlaylist = async (id) => {
  const { data } = await api.delete(`/playlists/${id}`);
  return data;
};
