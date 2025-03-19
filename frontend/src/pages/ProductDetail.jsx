import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Tag,
  User,
  Calendar,
  Share,
  Flag,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  // Sample data for demonstration
  const product = [
    {
      id: 0,
      title: "Dell XPS 13 Laptop - 2023 Model",
      price: 850,
      shortDescription:
        "Dell XPS 13 laptop in excellent condition. Intel Core i7, 16GB RAM, 512GB SSD. Includes charger and original box.",
      description:
        "Selling my Dell XPS 13 laptop. Only 6 months old and in excellent condition. Intel Core i7 processor, 16GB RAM, 512GB SSD. Battery life is still excellent (around 10 hours of regular use). Comes with original charger and box. Selling because I'm upgrading to a MacBook for design work.\n\nSpecs:\n- Intel Core i7 11th Gen\n- 16GB RAM\n- 512GB NVMe SSD\n- 13.4\" FHD+ Display (1920x1200)\n- Windows 11 Pro\n- Backlit Keyboard\n- Thunderbolt 4 ports",
      condition: "Like New",
      category:
        "Electronics, Electronics, Electronics,  Electronics , Electronics , Electronics,  Electronicss",
      datePosted: "2023-03-02",
      images: [
        "/image1.avif",
        "/image2.avif",
        "/image3.avif",
        "/image3.avif",
        "/image3.avif",
      ],
      seller: {
        name: "Michael T.",
        rating: 4.8,
        memberSince: "January 2022",
        avatar: "/Profile.jpg",
      },
    },
  ];

  console.log(product[id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // TODO: this would send the message to the seller
    console.log("Message sent:", message);
    setMessage("");
    setShowContactForm(false);
    // Show confirmation or success message
    alert("Message sent to seller!");
  };

  // Function to split description into paragraphs
  const formatDescription = (text) => {
    return text.split("\n\n").map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < paragraph.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  // image navigation
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb & Back Link */}
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
        {/* Left Column - Images */}
        <div className="md:w-3/5">
          {/* Main Image */}
          <div className="bg-white border border-gray-200 mb-4 relative">
            <img
              src={product[id].images[currentImage]}
              alt={product[id].title}
              className="w-full h-auto object-contain cursor-pointer"
              onClick={nextImage}
            />
          </div>

          {/* Thumbnail Images */}
          {product[id].images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product[id].images.map((image, index) => (
                <div
                  key={index}
                  className={`bg-white border ${currentImage === index ? "border-green-500" : "border-gray-200"} min-w-[100px] cursor-pointer`}
                  onClick={() => selectImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product[id].title} - view ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="md:w-2/5">
          {/* Product Info Card */}
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {product[id].title}
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
              ${product[id].price}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm">
              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-1" />
                <span>{product[id].category}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Condition:</span>
                <span className="ml-1">{product[id].condition}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted on {product[id].datePosted}</span>
              </div>
            </div>

            {/* Short Description */}
            <div className="bg-gray-50 p-4 mb-6 border border-gray-200">
              <p className="text-gray-700">{product[id].shortDescription}</p>
            </div>

            {/* Contact Button */}
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 mb-3"
            >
              Contact Seller
            </button>

            {/* TODO:Contact Form */}
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
                      value={product[id].User.email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
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

            {/* Seller Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="mr-3">
                  {product[id].seller.avatar ? (
                    <img
                      src={product[id].seller.avatar}
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
                    {product[id].seller.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Member since {product[id].seller.memberSince}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>
                  <span className="font-medium">Rating:</span>{" "}
                  {product[id].seller.rating}/5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-gray-700">
            {formatDescription(product[id].description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
