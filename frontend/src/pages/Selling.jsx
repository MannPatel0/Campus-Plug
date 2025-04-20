import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { X } from "lucide-react";

const Selling = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const [editingProduct, setEditingProduct] = useState({
    name: "",
    price: "",
    description: "",
    categories: [],
    images: [],
  });

  // Simulate fetching products from API/database on component mount
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
              userID: storedUser.ID, // Assuming you have userId defined elsewhere in your component
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
  }, []); // Add userId to dependency array if it might change

  // Handle creating or updating a product
  const handleSaveProduct = () => {
    if (editingProduct.id) {
      // Update existing product
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      );
    } else {
      // Create new product
      const newProduct = {
        ...editingProduct,
        id: Date.now().toString(), // Generate a temporary ID
      };
      setProducts([...products, newProduct]);
    }

    // Reset form and hide it
    setShowForm(false);
    setEditingProduct({
      name: "",
      price: "",
      description: "",
      categories: [],
      images: [],
    });
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      images: product.images || [], // Ensure images array exists
    });
    setShowForm(true);
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    setEditingProduct({
      name: "",
      price: "",
      description: "",
      categories: [],
      images: [],
    });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
        {!showForm && (
          <button
            onClick={handleAddProduct}
            className="bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
          >
            + Add New Product
          </button>
        )}
      </div>

      {showForm ? (
        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 mb-4">
                You don't have any listings yet
              </p>
              <button
                onClick={handleAddProduct}
                className="bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
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
                  <div
                    key={product.ProductID}
                    className="border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
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

                      <p className="text-emerald-600 font-bold mt-1">
                        ${product.Price}
                      </p>

                      {product.categories && product.categories.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {product.CategoryID.map((category) => (
                            <span
                              key={category}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 "
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {product.Description}
                      </p>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium"
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
    </div>
  );
};

export default Selling;
