import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Selling from "./pages/Selling";
import Transactions from "./pages/Transactions";
import Favorites from "./pages/Favorites";
import ProductDetail from "./pages/ProductDetail";

function App() {
  // Authentication state - initialize from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // UI state for login/signup form
  const [isSignUp, setIsSignUp] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-hide image on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowImage(false);
      } else {
        setShowImage(true);
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Get form data directly from the form
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    // Validate email and password
    if (!formValues.email || !formValues.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Handle Sign Up
        console.log("Sign Up Form Data:", formValues);

        // You could add API endpoint for registration here
        // For now, we'll just simulate a successful registration
        const newUser = {
          name: formValues.name,
          email: formValues.email,
          ucid: formValues.ucid,
          phone: formValues.phone,
        };

        // Set authenticated user
        setUser(newUser);
        setIsAuthenticated(true);

        // Save to localStorage to persist across refreshes
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(newUser));

        console.log("New user registered:", newUser);
      } else {
        // Handle Login with API
        console.log("Login Attempt:", {
          email: formValues.email,
          password: formValues.password,
        });

        // Make API call to localhost:3030/find_user
        const response = await fetch("http://localhost:3030/find_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formValues.email,
            password: formValues.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const userData = await response.json();

        if (userData && userData.found) {
          // Create user object
          const userObj = {
            name: userData.name || userData.email,
            email: userData.email,
            // Add any other user data returned from the API
          };

          // Set authenticated user with data from API
          setUser(userObj);
          setIsAuthenticated(true);

          // Save to localStorage to persist across refreshes
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(userObj));

          console.log("Login successful for:", userData.email);
        } else {
          // Show error message for invalid credentials
          setError("Invalid email or password");
          console.log("Login failed: Invalid credentials");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    console.log("User logged out");
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear errors when switching modes
  };

  // Login component
  const LoginComponent = () => (
    <div className="flex h-screen bg-white">
      {/* Image Section - Automatically hidden on mobile */}
      {showImage && (
        <div className="w-1/2 relative">
          <img
            src="../market.png"
            alt="auth illustration"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0"></div>
        </div>
      )}

      {/* Auth Form Section */}
      <div
        className={`${
          showImage ? "w-1/2" : "w-full"
        } bg-white p-8 flex items-center justify-center`}
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp ? "Set up your new account" : "Sign in to your account"}
            </p>
          </div>

          <div className="border border-gray-200 shadow-sm p-6">
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field - only for signup */}
              {isSignUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-medium text-gray-800"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required={isSignUp}
                  />
                </div>
              )}

              {isSignUp && (
                <div>
                  <label
                    htmlFor="ucid"
                    className="block mb-1 text-sm font-medium text-gray-800"
                  >
                    UCID
                  </label>
                  <input
                    type="text"
                    id="ucid"
                    name="ucid"
                    placeholder="1234567"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@ucalgary.ca"
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-1 text-sm font-medium text-gray-800"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+1(123)456 7890"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder={
                    isSignUp
                      ? "Create a secure password"
                      : "Enter your password"
                  }
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-2 text-base font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors disabled:bg-green-300"
                >
                  {isLoading
                    ? "Please wait..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={toggleAuthMode}
                  type="button"
                  className="text-green-500 font-medium hover:text-green-700"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Only show navbar when authenticated */}
        {isAuthenticated && (
          <Navbar onLogout={handleLogout} userName={user?.name} />
        )}

        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginComponent />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-6">
                  <Home />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-6">
                  <Settings />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/selling"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-6">
                  <Selling />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-6">
                  <Transactions />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-6">
                  <Favorites />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect to login for any unmatched routes */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
