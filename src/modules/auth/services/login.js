import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  const response = await instance.post('api/auth/login', { username, password });

  return { data: response.data.token, role: response.data.role, userID: response.data.userID, error: null };
};