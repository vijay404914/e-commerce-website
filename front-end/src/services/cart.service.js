import * as CartApi from "../api/cart.api";

export const addToCart = async (payload) => {
  const response = await CartApi.addToCart(payload);
  return response.data;
};

export const getCart = async () => {
  const response = await CartApi.getCart();
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const formData = new FormData();
  formData.append("quantity", quantity);

  const response = await CartApi.updateQuantity(id, formData);
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await CartApi.removeCartItem(id);
  return response.data;
};