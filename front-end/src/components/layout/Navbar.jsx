import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

import * as AuthService from "../../services/auth.service";
import { getToken } from "../../services/token.service";

export default function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!getToken();

  const handleLogout = async () => {
    try {
      // await AuthService.logout();

      toast.success("Logged out successfully.");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Unable to logout.");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600"
          >
            ShopVerse
          </Link>

          {isLoggedIn && (
            <div className="flex items-center gap-6">

              <Link
                to="/products"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Products
              </Link>

              <Link
                to="/orders"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                My Orders
              </Link>

              <Link
                to="/favorites"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                My Favorites
              </Link>

            </div>
          )}

        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-6">

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-indigo-600"
            >
              <ShoppingCart size={26} />

              {/* Replace this with API cart count */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
            >
              Logout
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-5">

            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
            >
              Register
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}
