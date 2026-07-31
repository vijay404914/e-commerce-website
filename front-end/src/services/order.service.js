import { createOrderApi } from "../api/order.api";


export const createOrder = async (payload) => {
  const response = await createOrderApi(payload);
  return response.data;
};