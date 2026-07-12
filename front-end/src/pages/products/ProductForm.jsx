import { useEffect, useState } from "react";

export default function ProductForm({ product, onSubmit }) {
  const CATEGORIES = [
    "electronics",
    "fashion",
    "books",
    "home",
    "sports",
  ];
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    status: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "",
        brand: product.brand || "",
        status: product.status || "",
        stock: product.stock || "",
        image: null,
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        price: "",
        description: "",
        category: "",
        brand: "",
        status: "",
        stock: "",
        image: null,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("product[name]", formData.name);
    payload.append("product[sku]", formData.sku);
    payload.append("product[price]", formData.price);
    payload.append("product[description]", formData.description);
    payload.append("product[category]", formData.category);
    payload.append("product[brand]", formData.brand);
    payload.append("product[status]", formData.status);
    payload.append("product[stock]", formData.stock);

    if (formData.image) {
      payload.append("product[image]", formData.image);
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            SKU
          </label>

          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Available Stock"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Category</option>

            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Product Image
          </label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>

        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write product description..."
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition"
        >
          {product ? "Update Product" : "Create Product"}
        </button>

      </div>

    </form>
  );
}