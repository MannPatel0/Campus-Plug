import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { X, ChevronLeft, Trash2 } from "lucide-react";

const Selling = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [categories, setCategories] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [originalProduct, setOriginalProduct] = useState(null);

  const [editingProduct, setEditingProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    images: [],
  });

  function reloadPage() {
    var doctTimestamp = new Date(performance.timing.domLoading).getTime();
    var now = Date.now();
    if (now > doctTimestamp) {
      location.reload();
    }
  }

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3030/api/category");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const responseJson = await response.json();
        const data = responseJson.data;

        // Create an array of category names for the dropdown
        const categoryNames = [];
        const mapping = {};

        // Process the data properly to avoid rendering objects
        Object.entries(data).forEach(([id, name]) => {
          // Make sure each category name is a string
          const categoryName = String(name);
          categoryNames.push(categoryName);
          mapping[categoryName] = parseInt(id);
        });

        setCategories(categoryNames);
        setCategoryMapping(mapping);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API/database on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          "http://localhost:3030/api/product/myProduct",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userID: storedUser.ID,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const datajson = await response.json();
        setProducts(datajson.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // You might want to set an error state here
      }
    };

    fetchProducts();
  });

  const handleEditProduct = (product) => {
    setOriginalProduct(product);

    const categoryName = getCategoryNameById(product.CategoryID);

    setEditingProduct({
      ...product,
      category: categoryName || "", // Single category string
      images: product.images || [],
    });

    setShowForm(true);
  };

  // Upload images to server and get their paths
  const uploadImages = async (images) => {
    console.log(images);
    const uploadedImagePaths = [];

    // Filter out only File objects (new images to upload)
    const filesToUpload = images.filter((img) => img instanceof File);

    for (const file of filesToUpload) {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Send the file to your upload endpoint
        const response = await fetch("http://localhost:3030/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${file.name}`);
        }

        const result = await response.json();
        // Assuming the server returns the path where the file was saved
        uploadedImagePaths.push(`/public/uploads/${file.name}`);
      } catch (error) {
        console.error("Error uploading image:", error);
        // If upload fails, still add the expected path (this is a fallback)
        uploadedImagePaths.push(`/public/uploads/${file.name}`);
      }
    }

    // Also include any existing image URLs that are strings, not File objects
    const existingImages = images.filter((img) => typeof img === "string");
    if (existingImages.length > 0) {
      uploadedImagePaths.push(...existingImages);
    }

    return uploadedImagePaths;
  };

  // Handle saving product with updated image logic
  const handleSaveProduct = async () => {
    if (!editingProduct.category) {
      alert("Please select a category");
      return;
    }

    try {
      let imagePaths = [];

      // Handle image uploads and get their paths
      if (editingProduct.images && editingProduct.images.length > 0) {
        imagePaths = await uploadImages(editingProduct.images);
      } else if (originalProduct?.image_url) {
        // If no new images but there was an original image URL
        imagePaths = [originalProduct.image_url];
      }

      const categoryID =
        categoryMapping[editingProduct.category] ||
        originalProduct?.CategoryID ||
        1;

      // Create payload with proper fallback to original values
      const payload = {
        name:
          editingProduct.Name ||
          editingProduct.name ||
          originalProduct?.Name ||
          "",
        price: parseFloat(
          editingProduct.Price ||
            editingProduct.price ||
            originalProduct?.Price ||
            0,
        ),
        qty: 1,
        userID: storedUser.ID,
        description:
          editingProduct.Description ||
          editingProduct.description ||
          originalProduct?.Description ||
          "",
        category: categoryID,
        images: imagePaths.length > 0 ? imagePaths : [],
      };

      console.log("Sending payload:", payload);

      const endpoint = editingProduct.ProductID
        ? `http://localhost:3030/api/product/update/${editingProduct.ProductID}`
        : "http://localhost:3030/api/product/addProduct";

      const method = editingProduct.ProductID ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `${editingProduct.ProductID ? "Failed to update" : "Failed to add"} product: ${errorData}`,
        );
      }

      const data = await response.json();
      console.log("Product saved:", data);

      // Reset form and hide it
      setShowForm(false);
      setEditingProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        images: [],
      });

      setOriginalProduct(null); // reset original as well

      reloadPage();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Error saving product: ${error.message}`);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "http://localhost:3030/api/product/delProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: storedUser.ID,
            productID: productId,
          }),
        },
      );
      reloadPage();
      console.log("deleteproodidt");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      // You might want to set an error state here
    }
  };

  // Helper function to get category name from ID
  const getCategoryNameById = (categoryId) => {
    if (!categoryId || !categoryMapping) return null;

    // Find the category name by ID
    for (const [name, id] of Object.entries(categoryMapping)) {
      if (id === categoryId) {
        return name;
      }
    }
    return null;
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    setEditingProduct({
      name: "",
      price: "",
      description: "",
      category: "",
      images: [],
    });
    setShowForm(true);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setEditingProduct({
      ...editingProduct,
      category: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
        {!showForm && (
          <button
            onClick={handleAddProduct}
            className="bg-emerald-700 text-white px-4 py-2 hover:bg-emerald-700"
          >
            + Add New Product
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white border border-gray-200 shadow-md p-6">
          {/* Back Button */}
          <button
            onClick={() => setShowForm(false)}
            className="mb-4 text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span>Back to Listings</span>
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
            {editingProduct?.ProductID
              ? "Edit Your Product"
              : "List a New Product"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={editingProduct.Name || editingProduct.name || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    Name: e.target.value,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={editingProduct.Price || editingProduct.price || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    Price: e.target.value,
                    price: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Category - Single Selection Dropdown */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={editingProduct.category || ""}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {!editingProduct.category && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a category
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={
                  editingProduct.Description || editingProduct.description || ""
                }
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    Description: e.target.value,
                    description: e.target.value,
                  })
                }
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none"
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
                <span className="text-emerald-700 font-medium">
                  Click to upload images (will be saved to /public/uploads)
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
                          src={
                            typeof img === "string"
                              ? img
                              : URL.createObjectURL(img)
                          }
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

              {/* Show current image if editing */}
              {editingProduct.image_url &&
                !(editingProduct.images || []).length && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <div className="relative w-20 h-20 border border-gray-200 overflow-hidden">
                      <img
                        src={editingProduct.image_url}
                        alt="Current product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveProduct}
              className="bg-emerald-700 text-white px-6 py-2 hover:bg-emerald-700 rounded-md"
            >
              {editingProduct.ProductID ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 mb-4">
                You don't have any listings yet
              </p>
              <button
                onClick={handleAddProduct}
                className="bg-emerald-700 text-white px-4 py-2 hover:bg-emerald-700"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.ProductID}
                  to={`/product/${product.ProductID}`}
                >
                  <div className="border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {product.image_url && product.image_url.length > 0 ? (
                        <img
                          src={product.image_url || ""}
                          alt={product.Name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {product.Name}
                        </h3>
                      </div>

                      <p className="text-emerald-700 font-bold mt-1">
                        ${product.Price}
                      </p>

                      {product.CategoryID && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
                            {getCategoryNameById(product.CategoryID) ||
                              product.CategoryID}
                          </span>
                        </div>
                      )}

                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {product.Description}
                      </p>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteProduct(product.ProductID);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditProduct(product);
                          }}
                          className="text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="border-t border-gray-700  text-center text-sm text-gray-400">
          <p>© 2025 Campus Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Selling;
