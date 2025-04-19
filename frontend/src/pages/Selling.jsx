import { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";

const Selling = () => {
  // State to store user's products
  const [products, setProducts] = useState([]);
  // State to control when editing form is shown
  const [showForm, setShowForm] = useState(false);
  // State to store the product being edited (or empty for new product)
  const [editingProduct, setEditingProduct] = useState({
    name: "",
    price: "",
    description: "",
    categories: [],
    images: [],
  });

  // Simulate fetching products from API/database on component mount
  useEffect(() => {
    // This would be replaced with a real API call
    const fetchProducts = async () => {
      // Mock data
      const mockProducts = [
        {
          id: "1",
          name: "Vintage Camera",
          price: "299.99",
          description: "A beautiful vintage film camera in excellent condition",
          categories: ["Electronics", "Art & Collectibles"],
          images: ["/public/Pictures/Dell1.jpg"],
        },
        {
          id: "2",
          name: "Leather Jacket",
          price: "149.50",
          description: "Genuine leather jacket, worn only a few times",
          categories: ["Clothing"],
          images: [],
        },
      ];

      setProducts(mockProducts);
    };

    fetchProducts();
  }, []);

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
                <div
                  key={product.id}
                  className="border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0] || ""}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-emerald-600 font-bold mt-1">
                      ${product.price}
                    </p>

                    {product.categories && product.categories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.categories.map((category) => (
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
                      {product.description}
                    </p>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-emerald-600 hover:text-emerald-800 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Selling;
