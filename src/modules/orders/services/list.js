import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (customerName = ' ', status = 'all', pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    customerName,
    status,
    pageNumber,
    pageSize,
  }).toString();
  const response = await instance.get(`api/orders?${queryString}`);

  return { data: response.data, error: null };

};