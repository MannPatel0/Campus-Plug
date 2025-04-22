import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("dateAdded");
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  function reloadPage() {
    const docTimestamp = new Date(performance.timing.domLoading).getTime();
    const now = Date.now();
    if (now > docTimestamp) {
      location.reload();
    }
  }

  const mapCategory = (id) => {
    return id || "Other";
  };

  const removeFromFavorites = async (itemID) => {
    const response = await fetch(
      "http://localhost:3030/api/product/delFavorite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: storedUser.ID,
          productID: itemID,
        }),
      },
    );

    const data = await response.json();
    if (data.success) {
      reloadPage();
    }

    if (!response.ok) throw new Error("Failed to remove from favorites");
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          "http://localhost:3030/api/product/getFavorites",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: storedUser.ID }),
          },
        );

        const data = await response.json();
        const favoritesData = data.favorites;

        if (!Array.isArray(favoritesData)) {
          console.error("Expected an array but got:", favoritesData);
          return;
        }

        const transformed = favoritesData.map((item) => ({
          id: item.ProductID,
          name: item.Name,
          price: parseFloat(item.Price),
          categories: [mapCategory(item.Category)],
          image: item.image_url || "/default-image.jpg",
          description: item.Description || "",
          seller: item.SellerName,
          datePosted: formatDatePosted(item.Date),
          dateAdded: item.Date || new Date().toISOString(),
        }));

        setFavorites(transformed);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const formatDatePosted = (dateString) => {
    const postedDate = new Date(dateString);
    const today = new Date();
    const diffInMs = today - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return `${diffInDays}d ago`;
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === "dateAdded")
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "priceLow") return a.price - b.price;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
      </div>

      {sortedFavorites.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-4">
            Items you save will appear here. Start browsing to add items to your
            favorites.
          </p>
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFavorites.map((product) => (
            <div
              key={product.id}
              className="border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={`/product/${product.id}`}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeFromFavorites(product.id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>

                  <p className="text-emerald-700 font-bold mt-1">
                    ${product.price.toFixed(2)}
                  </p>

                  {product.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.categories.map((category) => (
                        <span
                          key={category}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-gray-400 text-xs mt-2">
                    Posted {product.datePosted}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {sortedFavorites.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          Showing {sortedFavorites.length}{" "}
          {sortedFavorites.length === 1 ? "item" : "items"}
        </div>
      )}

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="border-t border-gray-700  text-center text-sm text-gray-400">
          <p>© 2025 Campus Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Favorites;
