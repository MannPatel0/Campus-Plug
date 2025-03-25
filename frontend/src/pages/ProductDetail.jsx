import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ArrowLeft, Tag, User, Calendar } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3030/api/product/get_productID/${id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        if (data.success) {
          setProduct(data.data); // Update the state with product details
        } else {
          throw new Error(data.message || "Error fetching product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle favorite toggle
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Handle message submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    // Handle message logic here (send to seller)
    console.log("Message sent:", message);
    setMessage("");
    setShowContactForm(false);
    alert("Message sent to seller!");
  };

  // Image navigation
  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const selectImage = (index) => {
    setCurrentImage(index);
  };

  if (!product) return <div>Loading...</div>; // Handle loading state

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
            <img
              src={product.images[currentImage]}
              alt={product.title}
              className="w-full h-auto object-contain cursor-pointer"
              onClick={nextImage}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`bg-white border ${currentImage === index ? "border-green-500" : "border-gray-200"} min-w-[100px] cursor-pointer`}
                  onClick={() => selectImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - view ${index + 1}`}
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
                {product.title}
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
              ${product.price}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm">
              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-1" />
                <span>{product.category}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Condition:</span>
                <span className="ml-1">{product.condition}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted on {product.datePosted}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 mb-6 border border-gray-200">
              <p className="text-gray-700">{product.shortDescription}</p>
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
                  {product.seller.avatar ? (
                    <img
                      src={product.seller.avatar}
                      alt="Seller"
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {product.seller.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Member since {product.seller.memberSince}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>
                  <span className="font-medium">Rating:</span>{" "}
                  {product.seller.rating}/5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-gray-700">{product.description}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
