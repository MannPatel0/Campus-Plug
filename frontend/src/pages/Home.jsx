import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, Book, Laptop, Sofa, Utensils, Gift, Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  // Same categories
  const categories = [
    { id: 1, name: 'Textbooks', icon: <Book className="h-5 w-5" /> },
    { id: 2, name: 'Electronics', icon: <Laptop className="h-5 w-5" /> },
    { id: 3, name: 'Furniture', icon: <Sofa className="h-5 w-5" /> },
    { id: 4, name: 'Kitchen', icon: <Utensils className="h-5 w-5" /> },
    { id: 5, name: 'Other', icon: <Gift className="h-5 w-5" /> },
  ];
  
  // Same listings data
  const [listings, setListings] = useState([
    {
      id: 0,
      title: 'Dell XPS 16 Laptop',
      price: 850,
      category: 'Electronics',
      image: 'image1.avif',
      condition: 'Good',
      seller: 'Michael T.',
      datePosted: '5d ago',
      isFavorite: true,
    },
  ]);
  
  // Toggle favorite status
  const toggleFavorite = (id, e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart icon
    setListings(
      listings.map((listing) =>
        listing.id === id ? { ...listing, isFavorite: !listing.isFavorite } : listing
      )
    );
  };

  const handleSelling = () => {
    navigate('/selling');

  }
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-green-100 py-8 px-4 mb-8 shadow-2xs">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Buy and Sell on Campus
          </h1>
          <p className="text-gray-600 mb-6">
            The marketplace exclusively for university students. Find everything you need or sell what you don't.
          </p>

          <button onClick={handleSelling}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 focus:outline-none focus:ring-2 focus:ring-green-400">
            Post an Item
          </button>
          
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
        
            <button
              key={category.id}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 hover:border-green-500 hover:shadow-sm"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-full mb-2">
                {category.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Recent Listings */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={`/product/${listing.id}`}
              className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <button
                  onClick={(e) => toggleFavorite(listing.id, e)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      listing.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800 leading-tight">
                    {listing.title}
                  </h3>
                  <span className="font-semibold text-green-600">${listing.price}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{listing.category}</span>
                  <span className="mx-2">•</span>
                  <span>{listing.condition}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{listing.datePosted}</span>
                  <span className="text-sm font-medium text-gray-700">{listing.seller}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;