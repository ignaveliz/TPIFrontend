import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (clientId = null, status = null, pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    clientId,
    status,
    pageNumber,
    pageSize,
  }).toString();
  const response = await instance.get(`api/orders?${queryString}`);

  return { data: response.data, error: null };

};