import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import * as OrderService from "../../services/order.service";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const data = await OrderService.getOrderDetails(id);
      setOrder(data);
    } catch (error) {
      toast.error("Unable to load order");
    }
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-indigo-100 text-indigo-700";
    }
  };

  if (!order) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-xl font-semibold animate-pulse">
          Loading Order...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <div className="flex flex-col md:flex-row justify-between gap-6">

            <div>
              <p className="text-gray-400 uppercase text-sm">
                Order Number
              </p>

              <h1 className="text-4xl font-bold mt-1">
                #{order.order_number || order.id}
              </h1>

              <p className="text-gray-500 mt-3">
                📅 {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-left md:text-right">

              <span
                className={`px-5 py-2 rounded-full font-semibold ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              <h2 className="text-4xl font-bold text-indigo-600 mt-5">
                ₹ {order.total_amount}
              </h2>

            </div>

          </div>

        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            📦 Ordered Products
          </h2>

          <div className="space-y-5">

            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="text-xl font-semibold">
                      {item.product_name}
                    </h3>

                    <div className="flex gap-8 mt-3 text-gray-600">

                      <p>
                        Quantity:
                        <span className="font-semibold ml-2">
                          {item.quantity}
                        </span>
                      </p>

                      <p>
                        Price:
                        <span className="font-semibold ml-2">
                          ₹ {item.unit_price}
                        </span>
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-500 text-sm">
                      Total
                    </p>

                    <h3 className="text-2xl font-bold text-indigo-600">
                      ₹ {item.total_price}
                    </h3>

                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            💳 Payment Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹ {order.total_amount}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">
                Free
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between text-2xl font-bold">
              <span>Total Paid</span>

              <span className="text-indigo-600">
                ₹ {order.total_amount}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}