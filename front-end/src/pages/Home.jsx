import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import * as CartService from "../services/cart.service";
import * as ProductService from "../services/product.service";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getProducts();

      setProducts(data);
    } catch (error) {
      toast.error("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const formData = new FormData();

      formData.append("product_id", product.id);
      formData.append("quantity", 1);

      const response = await CartService.addToCart(formData);

      toast.success(response.message || "Product added to cart.");
    } catch (error) {
      const message = error.response?.data?.error;

      if (message === "Product already added to cart.") {
        toast.error("Product is already in your cart.");
      } else {
        toast.error(message || "Unable to add product.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Latest Products
        </h1>

        <p className="text-gray-500 mt-2">
          Explore our latest collection.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
            >

              <img
                src={
                  product.image_url ||
                  "https://placehold.co/600x400?text=No+Image"
                }
                alt={product.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-semibold truncate">
                  {product.name}
                </h2>

                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-3 flex justify-between items-center">

                  <span className="text-xl font-bold text-indigo-600">
                    ₹ {product.price}
                  </span>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>

                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add To Cart
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}