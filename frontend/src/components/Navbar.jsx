import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { Search, Heart } from "lucide-react";

const Navbar = ({ onLogout, userName, isAdmin, handleShowAdminDashboard }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // if (!searchQuery.trim()) return;

    // Navigate to search page with query
    navigate({
      pathname: "/search",
      search: `?name=${encodeURIComponent(searchQuery)}`,
    });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/icon/icon-512.png"
                alt="Campus Plug"
                className="h-8 px-2"
              />
              <span className="hidden md:block text-emerald-600 font-bold text-xl">
                Campus Plug
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl px-4">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="w-full p-2 pl-10 pr-4 border border-gray-300 focus:outline-none focus:border-[#ed7f30]-500 focus:ring-1 focus:ring-[#ed7f30]-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-[#ed7f30]-500"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* User Navigation */}
          <div className="flex items-center space-x-4">
            {/* Favorites Button */}
            <Link
              to="/favorites"
              className="p-2 text-gray-600 hover:text-[#ed7f30]-600"
            >
              <Heart className="h-6 w-6" />
            </Link>

            {/* User Profile */}
            <UserDropdown
              isAdmin={isAdmin}
              onLogout={onLogout}
              userName={userName}
              handleShowAdminDashboard={handleShowAdminDashboard}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
