import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (orderData) => {
  const response = await instance.post('/api/orders', {
    customerId: orderData.userId,
    shippingAddress: 'Calle Falsa 123',
    billingAddress: 'Calle Falsa 123',
    notes: '',
    orderItems: orderData.items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.currentUnitPrice,
    })),
  });

  return response.data;
};