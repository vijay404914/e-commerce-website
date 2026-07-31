import api from "./axios";

export const createOrderApi = (payload) => {
  return api.post("/api/v1/orders", payload);
};
