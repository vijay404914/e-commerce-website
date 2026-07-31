import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import * as CartService from "../../services/cart.service";
import * as ProductService from "../../services/product.service";
import { createPayment } from "../../services/payment.service";
import { createOrder } from "../../services/order.service";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartResponse = await CartService.getCart();

      const cartItems = await Promise.all(
        cartResponse.cart_items.map(async (item) => {
          const product = await ProductService.getProduct(item.product_id);

          return {
            ...item,
            product,
          };
        })
      );

      setCart({
        ...cartResponse,
        cart_items: cartItems,
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (item, quantity) => {
	  if (quantity < 1) return;

	  try {
	    await CartService.updateCartItem(item.id, quantity);

	    toast.success("Cart updated");

	    fetchCart();
	  } catch (error) {
	    console.error(error);
	    toast.error("Unable to update cart");
	  }
	};

	const handleRemove = async (itemId) => {
	  try {
	    await CartService.removeCartItem(itemId);

	    toast.success("Item removed");

	    fetchCart();
	  } catch (error) {
	    console.error(error);
	    toast.error("Unable to remove item");
	  }
	};

  
  const handleCheckout = async () => {
    try {
      const order = await createOrder({
        payment_method: "stripe",
      });

      const payment = await createPayment({
        payment: {
          order_id: order.id,
          amount: order.total_amount,
          currency: "INR",
          payment_method: "card"
        }
      });

      navigate("/payment", {
        state: {
          clientSecret: payment.client_secret,
          paymentId: payment.payment_id,
          orderId: order.id,
        },
      });
    } catch (error) {
      toast.error("Checkout failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading...
      </div>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-3">
            Add products to your cart.
          </p>
        </div>
      </div>
    );
  }

  const totalQuantity = cart.cart_items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.cart_items.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        My Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}

        <div className="lg:col-span-2 space-y-6">

          {cart.cart_items.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-5 flex gap-5"
            >

              <img
                src={
                  item.product.image_url ||
                  "https://placehold.co/150x150?text=No+Image"
                }
                alt={item.product.name}
                className="w-36 h-36 rounded-lg object-cover border"
              />

              <div className="flex-1">

                <h2 className="text-2xl font-semibold">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.product.description}
                </p>

                <div className="flex gap-5 mt-3 text-sm">

                  <span>
                    <strong>Brand:</strong>{" "}
                    {item.product.brand}
                  </span>

                  <span>
                    <strong>Category:</strong>{" "}
                    {item.product.category}
                  </span>

                </div>

                <div className="mt-3 text-2xl font-bold text-indigo-600">
                  ₹ {item.product.price}
                </div>

                <div className="mt-5 flex items-center gap-3">

                  <button
									  onClick={() =>
									    handleQuantityChange(item, item.quantity - 1)
									  }
									  className="border rounded px-3 py-1 hover:bg-gray-100"
									>
									  -
									</button>

                  <span className="font-semibold text-lg">
                    {item.quantity}
                  </span>

                  <button
									  onClick={() =>
									    handleQuantityChange(item, item.quantity + 1)
									  }
									  className="border rounded px-3 py-1 hover:bg-gray-100"
									>
									  +
									</button>
                </div>
              </div>
              <div className="flex items-start">
                <button
								  onClick={() => handleRemove(item.id)}
								  className="text-red-500 hover:text-red-700 font-semibold"
								>
								  Remove
								</button>
              </div>
            </div>
          ))}
        </div>
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between mb-4">

              <span>Total Items</span>

              <span>{cart.cart_items.length}</span>

            </div>

            <div className="flex justify-between mb-4">

              <span>Total Quantity</span>

              <span>{totalQuantity}</span>

            </div>

            <div className="flex justify-between mb-6 text-xl font-bold">

              <span>Total Price</span>

              <span className="text-indigo-600">
                ₹ {totalPrice}
              </span>

            </div>

            <hr className="mb-6" />

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
            >
              Proceed To Checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
