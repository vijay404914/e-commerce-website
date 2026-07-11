import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../../api/auth.api";
import { getToken, removeToken } from "../../services/token.service";

export default function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!getToken();

  const handleLogout = async () => {
    try {
      await logout();

      removeToken();

      toast.success("Logged out successfully.");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);

      toast.error("Unable to logout.");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600"
        >
          ShopVerse
        </Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-5">
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              Register
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}