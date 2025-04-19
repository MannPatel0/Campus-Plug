import React, { useState } from "react";
import { X, ChevronLeft, Plus, Trash2, Check } from "lucide-react";

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

  const toggleSoldStatus = () => {
    setEditingProduct((prev) => ({
      ...prev,
      isSold: !prev.isSold,
    }));
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md p-6">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="mb-4 text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        <span>Back to Listings</span>
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
        {editingProduct?.id ? "Edit Your Product" : "List a New Product"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={editingProduct.name || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            value={editingProduct.price || ""}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Sold Status */}
        <div className="md:col-span-2">
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="soldStatus"
              checked={editingProduct.isSold || false}
              onChange={toggleSoldStatus}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="soldStatus" className="ml-2 text-sm text-gray-700">
              Mark as {editingProduct.isSold ? "Available" : "Sold"}
            </label>
            {editingProduct.isSold && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Sold
              </span>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 focus:border-emerald-500 focus:outline-none"
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
              className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>

          {/* Selected Categories */}
          {(editingProduct.categories || []).length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {(editingProduct.categories || []).map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-1 text-emerald-600 hover:text-emerald-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Please select at least one category
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-500 focus:outline-none"
            placeholder="Describe your product in detail..."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images <span className="text-gray-500">(Max 5)</span>
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 5);
              setEditingProduct((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...files].slice(0, 5),
              }));
            }}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block w-full p-3 border border-gray-300 bg-gray-50 text-center cursor-pointer hover:bg-gray-100"
          >
            <span className="text-emerald-600 font-medium">
              Click to upload images
            </span>
          </label>

          {/* Image previews */}
          {(editingProduct.images || []).length > 0 && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">
                  {editingProduct.images.length}{" "}
                  {editingProduct.images.length === 1 ? "image" : "images"}{" "}
                  selected
                </p>
                <button
                  onClick={() =>
                    setEditingProduct((prev) => ({ ...prev, images: [] }))
                  }
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  <span>Clear all</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editingProduct.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 border border-gray-200 overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Product ${idx + 1}`}
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
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
        <button
          onClick={toggleSoldStatus}
          className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
            editingProduct.isSold
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          <Check size={16} />
          <span>Mark as {editingProduct.isSold ? "Available" : "Sold"}</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-emerald-600 text-white px-6 py-2 hover:bg-emerald-700 rounded-md"
          >
            {editingProduct.id ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
