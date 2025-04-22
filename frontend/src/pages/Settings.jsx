import { useState, useEffect } from "react";
import { User, Lock, Trash2, History, Shield } from "lucide-react";
import FloatingAlert from "../components/FloatingAlert"; // adjust path if needed

const Settings = () => {
  const [userData, setUserData] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    UCID: "",
    address: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

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
        const response = await fetch(
          "http://localhost:3030/api/user/find_user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: storedUser.email,
            }),
          },
        );

        const data = await response.json();
        console.log(data);

        if (data.found) {
          // Update state with fetched data
          setUserData((prevData) => ({
            ...prevData,
            userId: storedUser.ID, // Try both sources
            name: data.name || storedUser.name || "",
            email: data.email || storedUser.email || "",
            UCID: data.UCID || storedUser.UCID || "",
            phone: data.phone || storedUser.phone || "",
            address: data.address || storedUser.address || "",
            password: data.password,
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

  const removeHistory = async () => {
    const response = await fetch(
      "http://localhost:3030/api/history/delHistory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: storedUser.ID,
        }),
      },
    );

    if (response.ok) {
      setShowAlert(true);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Ensure userId is present
      if (!userData.userId) {
        throw new Error("User ID is missing. Unable to update profile.");
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3030/api/user/update", {
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
        const response = await fetch("http://localhost:3030/api/user/delete", {
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

        alert("Cannot delete account, Please logout and retry:");
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
          <form onSubmit={handleUpdateProfile}>
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-emerald-600"
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  password
                </label>
                <input
                  type="text"
                  id="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {/* Privacy Section */}
      {showAlert && (
        <FloatingAlert
          message="We Removed Your History! 😉"
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Privacy</h2>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-start">
                <History className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800"> History</h3>
                  <p className="text-sm text-gray-500">
                    Delete all your history on Market
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeHistory()}
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
          <h2 className="text-lg font-medium text-red-700">Danger Zone !!!</h2>
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
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="border-t border-gray-700  text-center text-sm text-gray-400">
          <p>© 2025 Campus Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
