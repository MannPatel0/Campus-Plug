import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Tag, ChevronLeft, ChevronRight, Bookmark, Loader } from "lucide-react";

import FloatingAlert from "../components/FloatingAlert"; // adjust path if needed

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState({
    recommendations: true,
    listings: true,
    history: true,
  });
  const recommendationsFetched = useRef(false);
  const historyFetched = useRef(false);

  //After user data storing the session.
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const toggleFavorite = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:3030/api/product/addFavorite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: storedUser.ID,
            productID: id,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setShowAlert(true);
        // Close alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
      }
      console.log(`Add Product -> Favorites: ${id}`);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const addHistory = async (id) => {
    try {
      await fetch("http://localhost:3030/api/history/addHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: storedUser.ID,
          productID: id,
        }),
      });
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  };

  // Fetch recommended products
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      // Skip if already fetched or no user data
      if (recommendationsFetched.current || !storedUser || !storedUser.ID)
        return;

      setIsLoading((prev) => ({ ...prev, recommendations: true }));
      try {
        recommendationsFetched.current = true; // Mark as fetched before the API call

        const response = await fetch(
          "http://localhost:3030/api/engine/recommended",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: storedUser.ID,
            }),
          },
        );
        if (!response.ok) throw new Error("Failed to fetch recommendations");

        const data = await response.json();
        if (data.success) {
          setRecommended(
            data.data.map((product) => ({
              id: product.ProductID,
              title: product.ProductName,
              price: product.Price,
              category: product.Category,
              image: product.ProductImage,
              seller: product.SellerName,
              datePosted: product.DateUploaded,
              isFavorite: false,
            })),
          );
        } else {
          throw new Error(data.message || "Error fetching recommendations");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError(error.message);
        // Reset the flag if there's an error so it can try again
        recommendationsFetched.current = false;
      } finally {
        setIsLoading((prev) => ({ ...prev, recommendations: false }));
      }
    };

    fetchRecommendedProducts();
  }, [storedUser]); // Keep dependency

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading((prev) => ({ ...prev, listings: true }));
      try {
        const response = await fetch(
          "http://localhost:3030/api/product/getProduct",
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        if (data.success) {
          setListings(
            data.data.map((product) => ({
              id: product.ProductID,
              title: product.ProductName,
              price: product.Price,
              category: product.Category,
              image: product.ProductImage,
              seller: product.SellerName,
              datePosted: product.DateUploaded,
              isFavorite: false,
            })),
          );
        } else {
          throw new Error(data.message || "Error fetching products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setIsLoading((prev) => ({ ...prev, listings: false }));
      }
    };

    fetchProducts();
  }, []);

  // Fetch user history
  useEffect(() => {
    const fetchUserHistory = async () => {
      // Skip if already fetched or no user data
      if (historyFetched.current || !storedUser || !storedUser.ID) return;

      setIsLoading((prev) => ({ ...prev, history: true }));
      try {
        historyFetched.current = true; // Mark as fetched before the API call

        const response = await fetch(
          "http://localhost:3030/api/history/getHistory",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: storedUser.ID,
            }),
          },
        );
        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();
        if (data.success) {
          setHistory(
            data.data.map((product) => ({
              id: product.ProductID,
              title: product.ProductName,
              price: product.Price,
              category: product.Category,
              image: product.ProductImage,
              seller: product.SellerName,
              datePosted: product.DateUploaded,
            })),
          );
        } else {
          throw new Error(data.message || "Error fetching history");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        setError(error.message);
        // Reset the flag if there's an error so it can try again
        historyFetched.current = false;
      } finally {
        setIsLoading((prev) => ({ ...prev, history: false }));
      }
    };

    fetchUserHistory();
  }, [storedUser]); // Keep dependency

  const handleSelling = () => {
    navigate("/selling");
  };

  // Loading indicator component
  const LoadingSection = () => (
    <div className="flex justify-center items-center h-48">
      <Loader className="animate-spin text-emerald-700 h-8 w-8" />
    </div>
  );

  // Product card component to reduce duplication
  const ProductCard = ({ product, addToHistory = false }) => (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      onClick={addToHistory ? () => addHistory(product.id) : undefined}
      className="bg-white border border-gray-200 hover:shadow-md transition-shadow w-70 flex-shrink-0 relative"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className="absolute top-0 right-0 p-2 rounded-bl-md bg-emerald-700 hover:bg-emerald-600 transition shadow-sm"
        >
          <Bookmark className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 leading-tight">
          {product.title}
        </h3>
        <span className="font-semibold text-emerald-700 block mt-1">
          ${product.price}
        </span>

        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Tag className="h-4 w-4 mr-1" />
          <span>{product.category}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
          <span className="text-xs text-gray-500">{product.datePosted}</span>
          <span className="text-sm font-medium text-gray-700">
            {product.seller}
          </span>
        </div>
      </div>
    </Link>
  );

  // Scrollable product list component to reduce duplication
  const ScrollableProductList = ({
    containerId,
    products,
    children,
    isLoading,
    addToHistory = false,
  }) => (
    <div className="relative py-4">
      {children}

      <div className="relative">
        <button
          onClick={() =>
            document
              .getElementById(containerId)
              .scrollBy({ left: -400, behavior: "smooth" })
          }
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          id={containerId}
          className="overflow-x-auto whitespace-nowrap flex space-x-6 scroll-smooth scrollbar-hide px-10 pl-0 rounded min-h-[250px]"
        >
          {isLoading ? (
            <LoadingSection />
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToHistory={addToHistory}
              />
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-48 text-gray-500">
              No products available
            </div>
          )}
        </div>

        <button
          onClick={() =>
            document
              .getElementById(containerId)
              .scrollBy({ left: 400, behavior: "smooth" })
          }
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Hero Section with School Background */}
        <div className="relative py-12 px-4 mb-8 shadow-sm">
          <div className="absolute inset-0 z-0 overflow-hidden bg-black bg-opacity-100">
            <img
              src="../public/Ucalgary.png"
              alt="University of Calgary"
              className="w-full h-full object-cover object-bottom opacity-45"
            />
          </div>

          <div className="max-w-2xl mx-auto text-center relative z-1">
            <h1 className="text-3xl font-bold text-white mb-4">
              Buy and Sell on Campus
            </h1>
            <p className="text-white mb-6">
              The marketplace exclusively for university students. Find
              everything you need or sell what you don't.
            </p>
            <button
              onClick={handleSelling}
              className="bg-emerald-700 hover:bg-emerald-700 text-white font-medium py-2 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
            >
              Post an Item
            </button>
          </div>
        </div>

        {/* Floating Alert */}
        {showAlert && (
          <FloatingAlert
            message="Product added to favorites!"
            onClose={() => setShowAlert(false)}
          />
        )}

        {/* Recommendations Section */}
        <ScrollableProductList
          containerId="RecomContainer"
          products={recommended}
          isLoading={isLoading.recommendations}
          addToHistory={true}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recommended For You
          </h2>
        </ScrollableProductList>

        {/* Recent Listings Section */}
        <ScrollableProductList
          containerId="listingsContainer"
          products={listings}
          isLoading={isLoading.listings}
          addToHistory={true}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Listings
          </h2>
        </ScrollableProductList>

        {/* History Section */}
        {(history.length > 0 || isLoading.history) && (
          <ScrollableProductList
            containerId="HistoryContainer"
            products={history}
            isLoading={isLoading.history}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Browsing History
            </h2>
          </ScrollableProductList>
        )}
      </div>
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="border-t border-gray-700  text-center text-sm text-gray-400">
          <p>© 2025 Campus Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
