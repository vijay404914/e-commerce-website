import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const orderId = params.get("order_id");
  const status = params.get("redirect_status");

  useEffect(() => {
    if (status === "succeeded") {
      const timer = setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 3000); // 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [status, orderId, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful
        </h1>

        <p className="mt-3 text-gray-600">
          Redirecting to your order...
        </p>
      </div>
    </div>
  );
}