import { useState, useEffect } from "react";
import { User, Lock, Trash2, History, Search, Shield } from "lucide-react";

const Settings = () => {
  const [userData, setUserData] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    UCID: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the user's data from localStorage
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        console.log(storedUser);

        if (!storedUser || !storedUser.email) {
          throw new Error("User details not found. Please log in again.");
        }

        // Make API call to fetch user data
        const response = await fetch("http://localhost:3030/find_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: storedUser.email,
          }),
        });

        const data = await response.json();
        console.log(data);

        if (data.found) {
          // Update state with fetched data
          setUserData((prevData) => ({
            ...prevData,
            userId: data.userId || storedUser.id || "", // Try both sources
            name: data.name || storedUser.name || "",
            email: data.email || storedUser.email || "",
            UCID: data.UCID || storedUser.UCID || "",
            phone: data.phone || storedUser.phone || "",
            address: data.address || storedUser.address || "",
            // Reset password fields
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
        } else {
          throw new Error(data.error || "Failed to retrieve user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(
          error.message || "An error occurred while loading your profile",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement the actual update API call
      console.log("Profile updated:", userData);

      // Update localStorage with new user data
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...storedUser,
        name: userData.name,
        phone: userData.phone,
        UCID: userData.UCID,
        address: userData.address,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      // Validate passwords match
      if (userData.newPassword !== userData.confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      // TODO: Implement the actual password update API call
      console.log("Password updated");

      // Update password in localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...storedUser,
        password: userData.newPassword,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Reset password fields
      setUserData((prevData) => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password: " + error.message);
    }
  };

  const handleDeleteHistory = (type) => {
    // TODO: Delete the specified history
    console.log(`Deleting ${type} history`);
    alert(`${type} history deleted successfully!`);
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        // Get user ID from state or localStorage
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const userId = storedUser.ID;

        if (!userId) {
          throw new Error("User ID not found");
        }

        // Make API call to delete the account
        const response = await fetch("http://localhost:3030/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Account deleted successfully. You will be logged out.");
          // Clear user data from localStorage and redirect to login
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("isAuthenticated");
          window.location.href = "/login";
        } else {
          throw new Error(data.error || "Failed to delete account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account: " + error.message);
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Account Settings
      </h1>

      {/* Error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Profile Information Section */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Profile Information
            </h2>
          </div>
        </div>

        <div className="p-4">
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                  readOnly // Email is often used as identifier and not changeable
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="UCID"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  UCID
                </label>
                <input
                  type="text"
                  id="UCID"
                  value={userData.UCID}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Password</h2>
          </div>
        </div>

        <div className="p-4">
          <form onSubmit={handlePasswordUpdate}>
            <div className="space-y-4 mb-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={userData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={userData.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Privacy</h2>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-start">
                <Search className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Search History</h3>
                  <p className="text-sm text-gray-500">
                    Delete all your search history on StudentMarket
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteHistory("search")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-start">
                <History className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Browsing History
                  </h3>
                  <p className="text-sm text-gray-500">
                    Delete all your browsing history on StudentMarket
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteHistory("browsing")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account (Danger Zone) */}
      <div className="bg-white border border-red-200 mb-6">
        <div className="border-b border-red-200 p-4 bg-red-50">
          <h2 className="text-lg font-medium text-red-700">Danger Zone</h2>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800">Delete Account</h3>
              <p className="text-sm text-gray-500">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
