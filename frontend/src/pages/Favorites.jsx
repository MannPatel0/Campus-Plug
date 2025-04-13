import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Tag, Trash2, Filter, ChevronDown } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterCategory, setFilterCategory] = useState("All");
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  const mapCategory = (id) => {
    const categories = {
      1: "Electronics",
      2: "Textbooks",
      3: "Furniture",
      4: "Clothing",
      5: "Kitchen",
      6: "Other",
    };
    return categories[id] || "Other";
  };

  function reloadPage() {
    var doctTimestamp = new Date(performance.timing.domLoading).getTime();
    var now = Date.now();
    if (now > doctTimestamp) {
      location.reload();
    }
  }

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

    if (!response.ok) throw new Error("Failed to fetch products");
    console.log(response);
    console.log(`Add Product -> History: ${itemID}`);
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
          title: item.Name,
          price: parseFloat(item.Price),
          category: mapCategory(item.CategoryID),
          image: item.image_url || "/default-image.jpg",
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

  const filteredFavorites =
    filterCategory === "All"
      ? sortedFavorites
      : sortedFavorites.filter((item) => item.category === filterCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
      </div>

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
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
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow relative"
            >
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50"
                title="Remove from favorites"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-800 leading-tight">
                      {item.title}
                    </h3>
                    <span className="font-semibold text-green-600">
                      ${item.price}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{item.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Listed {item.datePosted}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {item.seller}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Show count if there are favorites */}
      {filteredFavorites.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          Showing {filteredFavorites.length}{" "}
          {filteredFavorites.length === 1 ? "item" : "items"}
          {filterCategory !== "All" && ` in ${filterCategory}`}
        </div>
      )}
    </div>
  );
};

export default Favorites;
