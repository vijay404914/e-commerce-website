import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/order.service";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-xl font-semibold animate-pulse">
          Loading Orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-24 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-5">📦</div>

          <h2 className="text-3xl font-bold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Looks like you haven't placed any orders.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              {orders.length} Orders
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="p-6">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

                  <div>

                    <p className="text-sm text-gray-400">
                      ORDER ID
                    </p>

                    <h2 className="text-2xl font-bold">
                      #{order.id}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </span>

                    <p className="text-3xl font-bold mt-4">
                      ₹ {order.total_amount}
                    </p>

                  </div>

                </div>

                <hr className="my-6" />

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div className="flex gap-8">

                    <div>
                      <p className="text-gray-400 text-sm">
                        Items
                      </p>

                      <p className="font-semibold">
                        {order.order_items?.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">
                        Payment
                      </p>

                      <p className="font-semibold text-green-600">
                        -
                      </p>
                    </div>

                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Details →
                  </Link>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}