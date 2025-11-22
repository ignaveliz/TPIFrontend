import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, email, role, password) => {
  const response = await instance.post('api/auth/register', {
    username,
    email,
    role,
    password,
  });

  return { data: response.data.token, role: response.data.role, error: null };
};