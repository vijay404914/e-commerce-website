import * as ProductApi from "../api/product.api";

export const getProducts = async () => {
  const response = await ProductApi.getProducts();
  return response.data;
};

export const getProduct = async (id) => {
  const response = await ProductApi.getProduct(id);
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await ProductApi.createProduct(payload);

  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await ProductApi.updateProduct(
    id,
    payload
  );

  return response.data;
};

export const deleteProduct = (id) =>
  ProductApi.deleteProduct(id);
