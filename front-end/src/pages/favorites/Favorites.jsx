import { Link } from "react-router-dom";

export default function Favorites() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            ❤️ Favorite Products
          </h1>

          <p className="text-gray-500 mt-2">
            Save your favorite products and find them here anytime.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

          <div className="text-7xl mb-6">
            🤍
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            No Favorite Products Yet
          </h2>

          <p className="text-gray-500 mt-4 max-w-md mx-auto">
            You haven't added any products to your favorites.
            Browse our collection and save the products you love.
          </p>

          <div className="mt-10 flex justify-center gap-4">

            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition"
            >
              Explore Products
            </Link>

            <Link
              to="/"
              className="border border-gray-300 hover:bg-gray-100 px-8 py-3 rounded-xl font-medium transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}