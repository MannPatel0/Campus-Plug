import React, { useState } from "react";

const ProductForm = ({
  editingProduct,
  setEditingProduct,
  onSave,
  onCancel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Toys & Games",
    "Books",
    "Sports & Outdoors",
    "Automotive",
    "Beauty & Personal Care",
    "Health & Wellness",
    "Jewelry",
    "Art & Collectibles",
    "Food & Beverages",
    "Office Supplies",
    "Pet Supplies",
    "Music & Instruments",
    "Other",
  ];

  const addCategory = () => {
    if (
      selectedCategory &&
      !(editingProduct.categories || []).includes(selectedCategory)
    ) {
      setEditingProduct((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), selectedCategory],
      }));
      setSelectedCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setEditingProduct((prev) => ({
      ...prev,
      categories: (prev.categories || []).filter(
        (cat) => cat !== categoryToRemove,
      ),
    }));
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-md p-6 shadow-lg">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="mb-4 text-sm text-emerald-600 hover:text-emerald-800 flex items-center font-medium"
      >
        ← Back to Listings
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-gray-100 pb-3">
        {editingProduct?.id ? "Edit Your Product" : "List a New Product"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: e.target.value,
              })
            }
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Categories - Dropdown with Add button */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories
                .filter(
                  (cat) => !(editingProduct.categories || []).includes(cat),
                )
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={addCategory}
              disabled={!selectedCategory}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {/* Selected Categories */}
          {(editingProduct.categories || []).length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {(editingProduct.categories || []).map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-emerald-100 text-emerald-800"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-emerald-600 hover:text-emerald-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              Please select at least one category
            </p>
          )}
        </div>

        {/* Status - Updated to Unsold/Sold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={editingProduct.status}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                status: e.target.value,
              })
            }
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Unsold">Unsold</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {/* Description - New Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={editingProduct.description || ""}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                description: e.target.value,
              })
            }
            rows="4"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Describe your product in detail..."
          ></textarea>
        </div>

        {/* Simplified Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images{" "}
            <span className="text-gray-500 text-sm">(Max 5)</span>
          </label>

          {/* Simple file input */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 5);
              setEditingProduct((prev) => ({
                ...prev,
                images: [...prev.images, ...files].slice(0, 5),
              }));
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block w-full p-3 border-2 border-dashed border-emerald-200 bg-emerald-50 rounded-md text-center cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <span className="text-emerald-700 font-medium">
              Click to upload images
            </span>
          </label>

          {/* Image previews */}
          {editingProduct.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {editingProduct.images.length}{" "}
                {editingProduct.images.length === 1 ? "image" : "images"}{" "}
                selected
              </p>
              <div className="flex flex-wrap gap-3">
                {editingProduct.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 border-2 border-gray-200 rounded-md overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Product image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        const updated = [...editingProduct.images];
                        updated.splice(idx, 1);
                        setEditingProduct((prev) => ({
                          ...prev,
                          images: updated,
                        }));
                      }}
                      className="absolute top-0 right-0 bg-white bg-opacity-80 w-6 h-6 flex items-center justify-center text-gray-700 hover:text-red-600"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {editingProduct.images.length > 0 && (
                  <button
                    onClick={() =>
                      setEditingProduct((prev) => ({ ...prev, images: [] }))
                    }
                    className="text-sm text-red-600 hover:text-red-800 mt-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-4 border-t-2 border-gray-100 pt-4">
        <button
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-emerald-600 text-white px-8 py-2 rounded-md hover:bg-emerald-700 font-medium"
        >
          {editingProduct.id ? "Update Product" : "Add Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
