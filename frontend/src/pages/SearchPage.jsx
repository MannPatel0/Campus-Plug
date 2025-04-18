import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nameParam = queryParams.get("name") || "";
  const initialSearchQuery = location.state?.query || nameParam || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts(initialSearchQuery);
  }, [initialSearchQuery]);

  const fetchProducts = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3030/api/search/getProduct`,
        {
          params: { name: query },
        },
      );

      if (response.data.success) {
        const transformedProducts = response.data.data.map((product) => ({
          id: product.ProductID,
          title: product.Name,
          description: product.Description || "",
          price: product.Price || 0,
          category: product.Category || "Uncategorized",
          condition: product.Condition || "Used",
          image: product.images,
          seller: product.SellerName || "Unknown Seller",
          isFavorite: false,
        }));

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } else {
        setError(response.data.message || "Failed to fetch products");
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Error connecting to the server");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, isFavorite: !product.isFavorite }
          : product,
      ),
    );
  };

  const filterProducts = () => {
    let result = products;
    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max,
    );
    setFilteredProducts(result);
  };

  const applyFilters = () => {
    filterProducts();
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setFilteredProducts(products);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar */}
        <div
          className={`
          fixed inset-0 z-50 bg-white transform transition-transform duration-300
          ${isFilterOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0 md:relative md:block md:w-72
          overflow-y-auto shadow-md
        `}
        >
          <div className="md:hidden flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={() => setIsFilterOpen(false)}>
              <X className="text-gray-600" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-50 p-3">
              <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border text-gray-700"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border text-gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={applyFilters}
                className="w-full bg-emerald-500 text-white p-3 hover:bg-emerald-600 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-700 p-3 hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 mt-4 md:mt-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredProducts.length} Results
            {searchQuery && (
              <span className="text-lg font-normal text-gray-600">
                {" "}
                for "{searchQuery}"
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredProducts.map((listing) => (
              <Link
                key={listing.id}
                to={`/product/${listing.id}`}
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow block"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {listing.title}
                  </h3>
                  <p className="text-emerald-600 font-semibold">
                    ${Number(listing.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Footer - Added here */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Campus Marketplace</h3>
              <p className="text-gray-400 text-sm">
                Your trusted university trading platform
              </p>
            </div>

            <div className="flex space-x-6">
              <div>
                <h4 className="font-medium mb-2">Quick Links</h4>
                <ul className="text-sm text-gray-400">
                  <li className="mb-1">
                    <Link to="/" className="hover:text-white transition">
                      Home
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/selling" className="hover:text-white transition">
                      Sell an Item
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link
                      to="/favorites"
                      className="hover:text-white transition"
                    >
                      My Favorites
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                <ul className="text-sm text-gray-400">
                  <li className="mb-1">support@campusmarket.com</li>
                  <li className="mb-1">University of Calgary</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} Campus Marketplace. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
