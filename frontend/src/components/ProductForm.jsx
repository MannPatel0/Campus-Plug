import React from "react";

const ProductForm = ({
  editingProduct,
  setEditingProduct,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md">
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="mb-4 text-sm text-blue-600 hover:underline flex items-center"
      >
        ← Back to Listings
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-6">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (1–5)
          </label>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <div className="flex flex-wrap gap-4 mt-4">
            {editingProduct.images.length > 0 &&
              editingProduct.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group w-24 h-24 border border-gray-300 overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      const updated = editingProduct.images.filter(
                        (_, i) => i !== idx,
                      );
                      setEditingProduct((prev) => ({
                        ...prev,
                        images: updated,
                      }));
                    }}
                    className="absolute top-1 right-1 bg-white bg-opacity-90 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-all text-gray-700 group-hover:opacity-100 opacity-0"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          {editingProduct.id ? "Update Product" : "Add Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
