import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tag, Heart } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [history, sethistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchrecomProducts = async () => {
      // Get the user's data from localStorage
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      console.log(storedUser);
      try {
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
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        console.log(data);
        if (data.success) {
          setRecommended(
            data.data.map((product) => ({
              id: product.ProductID,
              title: product.ProductName, // Use the alias from SQL
              price: product.Price,
              category: product.Category, // Ensure this gets the category name
              image: product.ProductImage, // Use the alias for image URL
              seller: product.SellerName, // Fetch seller name properly
              datePosted: product.DateUploaded, // Use the actual date
              isFavorite: false, // Default state
            })),
          );
        } else {
          throw new Error(data.message || "Error fetching products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      }
    };
    fetchrecomProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3030/api/product/get_product",
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        if (data.success) {
          setListings(
            data.data.map((product) => ({
              id: product.ProductID,
              title: product.ProductName, // Use the alias from SQL
              price: product.Price,
              category: product.Category, // Ensure this gets the category name
              image: product.ProductImage, // Use the alias for image URL
              seller: product.SellerName, // Fetch seller name properly
              datePosted: product.DateUploaded, // Use the actual date
              isFavorite: false, // Default state
            })),
          );
        } else {
          throw new Error(data.message || "Error fetching products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchrecomProducts = async () => {
      // Get the user's data from localStorage
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      console.log(storedUser);
      try {
        const response = await fetch("http://localhost:3030/api/get/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: storedUser.ID,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        console.log(data);
        if (data.success) {
          sethistory(
            data.data.map((product) => ({
              id: product.ProductID,
              title: product.ProductName, // Use the alias from SQL
              price: product.Price,
              category: product.Category, // Ensure this gets the category name
              image: product.ProductImage, // Use the alias for image URL
              seller: product.SellerName, // Fetch seller name properly
              datePosted: product.DateUploaded, // Use the actual date
              isFavorite: false, // Default state
            })),
          );
        } else {
          throw new Error(data.message || "Error fetching products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      }
    };
    fetchrecomProducts();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id, e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart icon
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === id
          ? { ...listing, isFavorite: !listing.isFavorite }
          : listing,
      ),
    );
  };

  const handleSelling = () => {
    navigate("/selling");
  };

  return (
    <div>
      {/* Hero Section with School Background */}
      <div className="relative py-12 px-4 mb-8 shadow-sm">
        {/* Background Image - Positioned at bottom */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black bg-opacity-100">
          <img
            src="../public/Ucalgary.png"
            alt="University of Calgary"
            className="w-full h-full object-cover object-bottom opacity-50"
          />
          {/* Dark overlay for better text readability */}
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto text-center relative z-1">
          <h1 className="text-3xl font-bold text-white mb-4">
            Buy and Sell on Campus
          </h1>
          <p className="text-white mb-6">
            The marketplace exclusively for university students. Find everything
            you need or sell what you don't.
          </p>
          <button
            onClick={handleSelling}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
          >
            Post an Item
          </button>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="relative py-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recommendation
        </h2>

        <div className="relative">
          {/* Left Button - Overlaid on products */}
          <button
            onClick={() =>
              document
                .getElementById("RecomContainer")
                .scrollBy({ left: -400, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
          >
            ◀
          </button>

          {/* Scrollable Listings Container */}
          <div
            id="RecomContainer"
            className="overflow-x-auto whitespace-nowrap flex space-x-6 scroll-smooth scrollbar-hide px-10 pl-0"
          >
            {recommended.map((recommended) => (
              <Link
                key={recommended.id}
                to={`/product/${recommended.id}`}
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow w-70 flex-shrink-0 relative"
              >
                <div className="relative">
                  <img
                    src={recommended.image}
                    alt={recommended.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => toggleFavorite(recommended.id, e)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        recommended.isFavorite
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 leading-tight">
                    {recommended.title}
                  </h3>
                  <span className="font-semibold text-green-600 block mt-1">
                    ${recommended.price}
                  </span>

                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{recommended.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
                    <span className="text-xs text-gray-500">
                      {recommended.datePosted}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {recommended.seller}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Button - Overlaid on products */}
          <button
            onClick={() =>
              document
                .getElementById("RecomContainer")
                .scrollBy({ left: 400, behavior: "smooth" })
            }
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="relative py-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Listings
        </h2>

        <div className="relative">
          {/* Left Button - Overlaid on products */}
          <button
            onClick={() =>
              document
                .getElementById("listingsContainer")
                .scrollBy({ left: -400, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
          >
            ◀
          </button>

          {/* Scrollable Listings Container */}
          <div
            id="listingsContainer"
            className="overflow-x-auto whitespace-nowrap flex space-x-6 scroll-smooth scrollbar-hide px-10 pl-0"
          >
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/product/${listing.id}`}
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow w-70 flex-shrink-0 relative"
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => toggleFavorite(listing.id, e)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        listing.isFavorite
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 leading-tight">
                    {listing.title}
                  </h3>
                  <span className="font-semibold text-green-600 block mt-1">
                    ${listing.price}
                  </span>

                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{listing.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
                    <span className="text-xs text-gray-500">
                      {listing.datePosted}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {listing.seller}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Button - Overlaid on products */}
          <button
            onClick={() =>
              document
                .getElementById("listingsContainer")
                .scrollBy({ left: 400, behavior: "smooth" })
            }
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="relative py-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">History</h2>

        <div className="relative">
          {/* Left Button - Overlaid on products */}
          <button
            onClick={() =>
              document
                .getElementById("HistoryContainer")
                .scrollBy({ left: -400, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
          >
            ◀
          </button>

          {/* Scrollable Listings Container */}
          <div
            id="HistoryContainer"
            className="overflow-x-auto whitespace-nowrap flex space-x-6 scroll-smooth scrollbar-hide px-10 pl-0"
          >
            {history.map((history) => (
              <Link
                key={history.id}
                to={`/product/${history.id}`}
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow w-70 flex-shrink-0 relative"
              >
                <div className="relative">
                  <img
                    src={history.image}
                    alt={history.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => toggleFavorite(history.id, e)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        history.isFavorite
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 leading-tight">
                    {history.title}
                  </h3>
                  <span className="font-semibold text-green-600 block mt-1">
                    ${history.price}
                  </span>

                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{history.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
                    <span className="text-xs text-gray-500">
                      {history.datePosted}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {history.seller}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Button - Overlaid on products */}
          <button
            onClick={() =>
              document
                .getElementById("HistoryContainer")
                .scrollBy({ left: 400, behavior: "smooth" })
            }
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white p-4 rounded-full z-20 hidden md:flex items-center justify-center w-12 h-12"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
