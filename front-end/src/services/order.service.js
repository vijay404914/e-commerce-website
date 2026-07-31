import {
  getOrdersApi,
  createOrderApi,
  getOrderDetailsApi
} from "../api/order.api";

export const getOrders = async () => {
  const response = await getOrdersApi();

  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await getOrderDetailsApi(orderId);

  return response.data;
};

export const createOrder = async (payload) => {
  const response = await createOrderApi(payload);

  return response.data;
};