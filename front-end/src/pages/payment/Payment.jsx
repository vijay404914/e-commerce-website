import { useLocation } from "react-router-dom";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  const { orderId, paymentId } = location.state;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/payment-success?order_id=${orderId}&payment_id=${paymentId}`,
      },
    });

    if (error) {
      toast.error(error.message);

      navigate("/payment-failed");

      return;
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow"
    >
      <h1 className="text-3xl font-bold mb-6">
        Complete Payment
      </h1>

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function Payment() {
  return <CheckoutForm />;
}