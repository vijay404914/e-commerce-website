import api from "./axios";

export const getProducts = () =>
  api.get("/api/v1/products");

export const createProduct = (payload) =>
  api.post("/api/v1/products", payload);

export const updateProduct = (id, payload) =>
  api.put(`/api/v1/products/${id}`, payload);

export const deleteProduct = (id) =>
  api.delete(`/api/v1/products/${id}`);
  