import api from "./axios";

export const getOrdersApi = () => 
  api.get("/api/v1/orders");
  
export const getOrderDetailsApi = (orderId) => {
  return api.get(`/api/v1/orders/${orderId}`);
};

export const createOrderApi = (payload) => {
  return api.post("/api/v1/orders", payload);
};
