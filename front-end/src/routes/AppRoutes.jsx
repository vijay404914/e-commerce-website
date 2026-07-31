import { Routes, Route, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProductList from "../pages/products/ProductList";
import Cart from "../pages/cart/cart";
import Payment from "../pages/payment/Payment";


const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function PaymentWrapper() {

  const location = useLocation();

  const clientSecret =
    location.state?.clientSecret;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <Payment />
    </Elements>
  );
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={<ProductList />}
          />
          <Route
            path="/cart"
            element={<Cart />}
          />
          <Route
            path="/payment"
            element={<PaymentWrapper />}
          />
        </Route>
      </Route>
    </Routes>
  );
}