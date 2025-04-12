import { useState, useEffect, setErrors } from "react";
import { useParams, Link, isSession } from "react-router-dom";
import { Heart, ArrowLeft, Tag, User, Calendar, Star } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState({
    product: true,
    reviews: true,
  });
  const [error, setError] = useState({
    product: null,
    reviews: null,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactForm, showContactForm, setShowContactForm] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 3,
    comment: "",
    name: "",
  });

  // Add this function to handle review input changes
  const handleReviewInputChange = (e) => {
    const { id, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Add this function to handle star rating selection
  const handleRatingChange = (rating) => {
    setReviewForm((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmitReview = async () => {
    try {
      // Ensure userId is present
      if (!userData.userId) {
        throw new Error("User ID is missing. Unable to update profile.");
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3030/api/review/add`, {
        method: "POST", // or "PUT" if your backend supports it
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      console.log("Profile updated successfully:", result);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.message || "An error occurred while updating your profile.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading((prev) => ({ ...prev, product: true }));
        const response = await fetch(`http://localhost:3030/api/product/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setProduct(result.data);
          setError((prev) => ({ ...prev, product: null }));
        } else {
          throw new Error(result.message || "Error fetching product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError((prev) => ({ ...prev, product: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, product: false }));
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading((prev) => ({ ...prev, reviews: true }));
        const response = await fetch(`http://localhost:3030/api/review/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setReviews(result.data || []);
          setError((prev) => ({ ...prev, reviews: null }));
        } else {
          throw new Error(result.message || "Error fetching reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError((prev) => ({ ...prev, reviews: error.message }));
        setReviews([]);
      } finally {
        setLoading((prev) => ({ ...prev, reviews: false }));
      }
    };

    fetchReviews();
  }, [id]);

  // Handle favorite toggle with error handling
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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setIsFavorite(!isFavorite);
      } else {
        throw new Error(result.message || "Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(`Failed to add to favorites: ${error.message}`);
    }
  };

  // Handle form input changes
  const handleContactInputChange = (e) => {
    const { id, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle message submission with improved validation
  const handleSendMessage = (e) => {
    e.preventDefault();

    // Basic validation
    if (!contactForm.email || !contactForm.phone) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // TODO: Implement actual message sending logic
    try {
      // Mock API call
      console.log("Message sent:", contactForm);
      setContactForm({
        email: "",
        phone: "",
        message: "Hi, is this item still available?",
      });
      setShowContactForm(false);
      alert("Message sent to seller!");
    } catch (error) {
      alert(`Failed to send message: ${error.message}`);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  const selectImage = (index) => {
    setCurrentImage(index);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />,
      );
    }
    return stars;
  };

  // Render loading state for the entire page
  if (loading.product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-green-500"></div>
      </div>
    );
  }

  // Render error state for product
  if (error.product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 mb-4">Error Loading Product</h2>
          <p className="text-gray-600">{error.product}</p>
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

  // Safety check for product
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 mb-4">Product Not Found</h2>
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
          to="/search"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/5">
          <div className="bg-white border border-gray-200 mb-4 relative">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImage]}
                  alt={product.Name}
                  className="w-full h-auto object-contain cursor-pointer"
                  onClick={nextImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
                {product.images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-between p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="bg-white/70 p-1 rounded-full"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="text-sm bg-white/70 px-2 py-1 rounded">
                      {currentImage + 1}/{product.images.length}
                    </div>
                  </div>
                )}
              </>
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/100x100?text=Error";
                    }}
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
                {product.Name || "Unnamed Product"}
              </h1>
              <button
                onClick={toggleFavorite}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`h-6 w-6 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            <div className="text-2xl font-bold text-green-600 mb-4">
              $
              {typeof product.Price === "number"
                ? product.Price.toFixed(2)
                : product.Price}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm">
              {product.Category && (
                <div className="flex items-center text-gray-600">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{product.Category}</span>
                </div>
              )}

              {product.Date && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted on {product.Date}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 mb-6 border border-gray-200">
              <p className="text-gray-700">
                {product.Description || "No description available"}
              </p>
            </div>

            {/* <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 mb-3"
            >
              Contact Seller
            </button> */}

            <div className="pt-4 border-t border-gray-200">
              {/* Seller Info */}
              <div className="flex items-center mb-3">
                <div className="mr-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {product.SellerName || "Unknown Seller"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Member since {product.SellerJoinDate || "N/A"}
                  </p>
                </div>
              </div>

              {/* Contact Options */}
              {showContactForm && (
                <div className="mt-4 border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Contact Seller
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`tel:${contactForm.phone}`}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 text-center "
                    >
                      Call Seller
                    </a>
                    <a
                      href={`mailto:${contactForm.email}`}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 text-center "
                    >
                      Email Seller
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>

        <div className="bg-white border border-gray-200 p-6">
          {loading.reviews ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
            </div>
          ) : error.reviews ? (
            <div className="text-red-500 mb-4">
              Error loading reviews: {error.reviews}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              No reviews yet for this product
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id || `review-${Math.random()}`}
                  className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-gray-800">
                      {review.ReviewerName || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.ReviewDate
                        ? new Date(review.ReviewDate).toLocaleDateString()
                        : "Unknown date"}
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    {renderStars(review.Rating || 0)}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.Rating || 0}/5
                    </span>
                  </div>

                  <div className="text-gray-700">
                    {review.Comment || "No comment provided"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
          >
            Write a Review
          </button>
        </div>

        {/* Review Popup Form */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={reviewForm.name}
                    onChange={handleReviewInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none mr-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewForm.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">
                      {reviewForm.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="comment" className="block text-gray-700 mb-1">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
