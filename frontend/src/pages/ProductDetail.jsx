import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ArrowLeft, Tag, User, Calendar } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3030/api/product/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const result = await response.json();
        console.log(result);

        if (result.success) {
          setProduct(result.data);
          setError(null);
        } else {
          throw new Error(result.message || "Error fetching product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle favorite toggle
  const toggleFavorite = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/api/product/add_to_favorite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: 1, // Replace with actual user ID
            productsID: id,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Handle message submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    // TODO: Implement actual message sending logic
    console.log("Message sent:", message);
    setMessage("");
    setShowContactForm(false);
    alert("Message sent to seller!");
  };

  // Image navigation
  const nextImage = () => {
    if (product && product.images) {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setCurrentImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  const selectImage = (index) => {
    setCurrentImage(index);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 mb-4">Error Loading Product</h2>
          <p className="text-gray-600">{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  // Render product details
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to listings</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/5">
          <div className="bg-white border border-gray-200 mb-4 relative">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[currentImage]}
                alt={product.Name}
                className="w-full h-auto object-contain cursor-pointer"
                onClick={nextImage}
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`bg-white border ${currentImage === index ? "border-green-500" : "border-gray-200"} min-w-[100px] cursor-pointer`}
                  onClick={() => selectImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.Name} - view ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-2/5">
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {product.Name}
              </h1>
              <button
                onClick={toggleFavorite}
                className="p-2 hover:bg-gray-100"
              >
                <Heart
                  className={`h-6 w-6 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            <div className="text-2xl font-bold text-green-600 mb-4">
              ${product.Price}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm">
              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-1" />
                <span>{product.Category}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Condition:</span>
                <span className="ml-1">{product.condition}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted on {product.Date}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 mb-6 border border-gray-200">
              <p className="text-gray-700">{product.Description}</p>
            </div>

            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 mb-3"
            >
              Contact Seller
            </button>

            {showContactForm && (
              <div className="border border-gray-200 p-4 mb-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  Contact Seller
                </h3>
                <form onSubmit={handleSendMessage}>
                  <div className="mb-3">
                    <label htmlFor="email" className="block text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="block text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="contactMessage"
                      className="block text-gray-700 mb-1"
                    >
                      Message (Optional)
                    </label>
                    <input
                      type="text"
                      id="contactMessage"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi, is this item still available?"
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4"
                  >
                    Send Contact Info
                  </button>
                </form>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="mr-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {product.UserID || "Unknown Seller"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Member since{" "}
                    {product.seller ? product.seller.memberSince : "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>
                  <span className="font-medium">Rating:</span>{" "}
                  {product.seller ? `${product.seller.rating}/5` : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-gray-700">{product.Description}</div>
        </div>
      </div> */}
    </div>
  );
};

export default ProductDetail;
