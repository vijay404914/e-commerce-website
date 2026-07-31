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
import Orders from "../pages/orders/Orders";
import OrderDetails from "../pages/orders/OrderDetails";
import Favorites from "../pages/favorites/Favorites";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentFailed from "../pages/payment/PaymentFailed";

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
          <Route
            path="/orders"
            element={<Orders />}
          />
          <Route 
            path="/orders/:id" 
            element={<OrderDetails />} 
          />
          <Route 
            path="/favorites" 
            element={<Favorites />} 
          />
          <Route 
            path="/payment-success" 
            element={<PaymentSuccess />} 
          />
          <Route
            path="/payment-failed"
            element={<PaymentFailed />}
          />
        </Route>
      </Route>
    </Routes>
  );
}