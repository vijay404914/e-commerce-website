import api from "./axios";

export const createPaymentApi = (payload) => {
  return api.post("/api/v1/payments", payload);
};
