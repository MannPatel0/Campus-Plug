import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, ShoppingBag, DollarSign, LogOut } from "lucide-react";

const UserDropdown = ({ onLogout, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Use passed userName or fallback to default
  const displayName = userName || "User";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Close the dropdown
    setIsOpen(false);

    // Call the onLogout function from props
    if (onLogout) {
      onLogout();
      console.log("Logout successful");
    }

    // Navigate to login page (this may be redundant as App.jsx should handle redirection)
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <User className="h-5 w-5 text-green-600" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md z-10">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              to="/selling"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="h-4 w-4 mr-2 text-gray-500" />
              My Listings
            </Link>

            <Link
              to="/transactions"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              Transactions
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2 text-gray-500" />
              Settings
            </Link>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2 text-gray-500" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
