import { instance } from '../../shared/api/axiosInstance';

async function getProducts(search = null, status = null, pageNumber = 1, pageSize = 20 ) {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};

async function getAll()
{

  const response = await instance.get('api/products');

  return { data: response.data, error: null };
};

export { getProducts, getAll };