import api from "./axios";

export const addToCart = (data) =>
  api.post("/api/v1/cart", data);

export const getCart = () =>
  api.get("/api/v1/cart");

export const removeCartItem = (id) =>
  api.delete(`/api/v1/cart/items/${id}`);

export const updateQuantity = (id, data) =>
  api.patch(`/api/v1/cart/items/${id}`, data);
