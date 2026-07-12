import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../components/common/Modal";
import ProductForm from "./ProductForm";
import * as ProductService from "../../services/product.service";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await ProductService.getProducts();

      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await ProductService.updateProduct(
          selectedProduct.id,
          formData
        );

        toast.success("Product updated successfully.");
      } else {
        await ProductService.createProduct(formData);

        toast.success("Product created successfully.");
      }

      closeModal();

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong.");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await ProductService.deleteProduct(id);

      toast.success("Product deleted successfully.");

      fetchProducts();
    } catch (error) {
      console.error(error);

      toast.error("Unable to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Products...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <button
            onClick={handleAddProduct}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Product
          </button>

        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Category</th>
                <th className="text-center p-4">Actions</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (
                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-8"
                  >
                    No Products Found
                  </td>

                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {product.name}
                    </td>

                    <td className="p-4">
                      ${product.price}
                    </td>

                    <td className="p-4">
                      {product.category}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            handleEditProduct(product)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteProduct(product.id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          selectedProduct
            ? "Edit Product"
            : "Add Product"
        }
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}