import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import ProductForm from "../components/ProductForm";

const Selling = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Green Sofa",
      price: 299,
      status: "Active",
      images: [],
    },
    {
      id: 2,
      name: "Wooden Table",
      price: 150,
      status: "Inactive",
      images: [],
    },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setView("form");
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: null,
      name: "",
      price: "",
      status: "Active",
      images: [],
    });
    setView("form");
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!editingProduct.name || !editingProduct.price) {
      alert("Please enter a name and price.");
      return;
    }
    if (editingProduct.images.length < 1) {
      alert("Please upload at least one image.");
      return;
    }

    if (editingProduct.id === null) {
      const newProduct = {
        ...editingProduct,
        id: Date.now(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      );
    }

    setEditingProduct(null);
    setView("list");
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setView("list");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {view === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Listings</h2>
            <button
              onClick={handleAddNew}
              className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-all"
            >
              <Plus className="inline-block mr-2" size={18} /> Add New Product
            </button>
          </div>

          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="border border-gray-300 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex items-start sm:items-center space-x-4 w-full sm:w-auto">
                  <div className="h-20 w-20 bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                    {product.images.length > 0 ? (
                      <img
                        src={URL.createObjectURL(product.images[0])}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <p
                      className={`text-xs mt-1 ${
                        product.status === "Active"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.status}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:underline"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "form" && (
        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Selling;
