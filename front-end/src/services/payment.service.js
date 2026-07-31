import { createPaymentApi } from "../api/payment.api";

export const createPayment = async (payload) => {
  const response = await createPaymentApi(payload);

  return response.data;

};
