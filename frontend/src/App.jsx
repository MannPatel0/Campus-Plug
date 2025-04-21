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
import SearchPage from "./pages/SearchPage";

function App() {
  // Authentication state - initialize from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // UI state for login/signup form
  const [isSignUp, setIsSignUp] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Product recommendation states
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // New verification states
  const [verificationStep, setVerificationStep] = useState("initial"); // 'initial', 'code-sent', 'verifying'
  const [tempUserData, setTempUserData] = useState(null);

  // Auto-hide image on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowImage(false);
      } else {
        setShowImage(true);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      sendSessionDataToServer();
    }
  }, [isAuthenticated, user]);

  // Generate product recommendations when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      generateProductRecommendations();
    }
  }, [isAuthenticated, user]);

  // Generate product recommendations
  const generateProductRecommendations = async () => {
    try {
      setIsGeneratingRecommendations(true);

      // Add a short delay to simulate calculation time
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Generating product recommendations for user:", user.ID);

      // Make API call to get recommendations
      const response = await fetch(
        "http://localhost:3030/api/recommendations/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.ID,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const result = await response.json();

      if (result.success) {
        console.log(
          "Recommendations generated successfully:",
          result.recommendations,
        );
        setRecommendations(result.recommendations);

        // Store recommendations in session storage for access across the app
        sessionStorage.setItem(
          "userRecommendations",
          JSON.stringify(result.recommendations),
        );
      } else {
        console.error("Error generating recommendations:", result.message);
      }
    } catch (err) {
      console.error("Error generating product recommendations:", err);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  // Send verification code
  const sendVerificationCode = async (userData) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Sending verification code to:", userData.email);

      // Make API call to send verification code
      const response = await fetch(
        "http://localhost:3030/api/user/send-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            // Add any other required fields
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      const result = await response.json();

      if (result.success) {
        // Store temporary user data
        setTempUserData(userData);
        // Move to verification step
        setVerificationStep("code-sent");
        console.log("Verification code sent successfully");
        return true;
      } else {
        setError(result.message || "Failed to send verification code");
        return false;
      }
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError("Failed to send verification code. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code
  const verifyCode = async (code) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Verifying code:", code);

      // Make API call to verify code
      const response = await fetch(
        "http://localhost:3030/api/user/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: tempUserData.email,
            code: code,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to verify code");
      }

      const result = await response.json();

      if (result.success) {
        console.log("Code verified successfully");
        // Proceed to complete signup
        return await completeSignUp(tempUserData);
      } else {
        setError(result.message || "Invalid verification code");
        return false;
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Failed to verify code. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete signup
  const completeSignUp = async (userData) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Completing signup for:", userData.email);
      console.log(userData);

      // Make API call to complete signup
      const response = await fetch(
        "http://localhost:3030/api/user/complete-signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to complete signup");
      }

      const result = await response.json();
      console.log(result);

      if (result.success) {
        // Create user object from API response
        const newUser = {
          ID: result.userID || result.ID,
          name: result.name || userData.name,
          email: result.email || userData.email,
          UCID: result.UCID || userData.ucid,
        };

        // Set authenticated user
        setUser(newUser);
        setIsAuthenticated(true);

        // Save to localStorage to persist across refreshes
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("user", JSON.stringify(newUser));

        // After successful signup, send session data to server
        sendSessionDataToServer();

        // Reset verification steps
        setVerificationStep("initial");
        setTempUserData(null);

        console.log("Signup completed successfully");

        // Generate recommendations for the new user
        generateProductRecommendations();

        return true;
      } else {
        setError(result.message || "Failed to complete signup");
        return false;
      }
    } catch (err) {
      console.error("Error completing signup:", err);
      setError("Failed to complete signup. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
    // else if (!formValues.email.endsWith("@ucalgary.ca")) {
    //   setError("Please use your UCalgary email address (@ucalgary.ca)");
    //   setIsLoading(false);
    //   return;
    // }
    try {
      if (isSignUp) {
        // Handle Sign Up with verification
        console.log("Sign Up Form Data:", formValues);

        // Create a user object with the form data
        const newUser = {
          name: formValues.name,
          email: formValues.email,
          UCID: formValues.ucid,
          phone: formValues.phone,
          password: formValues.password, // This will be needed for the final signup
          address: formValues.address, // Add this line
          client: 1,
          admin: 0,
        };

        // Send verification code
        await sendVerificationCode(newUser);
      } else {
        // Handle Login with API
        console.log("Login Attempt:", {
          email: formValues.email,
          password: formValues.password,
        });

        // Make API call to localhost:3030/find_user
        const response = await fetch(
          "http://localhost:3030/api/user/do_login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formValues.email,
              password: formValues.password,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const userData = await response.json();

        if (userData && userData.found) {
          // Create user object
          const userObj = {
            ID: userData.userID,
            name: userData.name,
            email: userData.email,
            // Add any other user data returned from the API
          };

          // Set authenticated user with data from API
          setUser(userObj);
          setIsAuthenticated(true);

          // Save to localStorage to persist across refreshes
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("user", JSON.stringify(userObj));

          console.log("Login successful for:", userData.email);

          // Start generating recommendations with a slight delay
          // This will happen in the useEffect, but we set a loading state to show to the user
          setIsGeneratingRecommendations(true);
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

  // Handle code verification submission
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const code = e.target.verificationCode.value;

    if (!code) {
      setError("Verification code is required");
      return;
    }

    await verifyCode(code);
  };

  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    setUser(null);
    setVerificationStep("initial");
    setTempUserData(null);
    setRecommendations([]);

    // Clear localStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRecommendations");

    console.log("User logged out");
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear errors when switching modes
    setVerificationStep("initial"); // Reset verification step
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (tempUserData) {
      await sendVerificationCode(tempUserData);
    }
  };

  // Back to signup form
  const handleBackToSignup = () => {
    setVerificationStep("initial");
    setError("");
  };

  const sendSessionDataToServer = async () => {
    try {
      // Retrieve data from sessionStorage
      const user = JSON.parse(sessionStorage.getItem("user"));

      if (!user || !isAuthenticated) {
        console.log("User is not authenticated");
        return;
      }

      // Prepare the data to send
      const requestData = {
        userId: user.ID, // or user.ID depending on your user structure
        email: user.email,
        isAuthenticated,
      };

      // Send data to Python server (replace with your actual server URL)
      const response = await fetch("http://0.0.0.0:5000/api/user/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // Check the response
      if (response.ok) {
        const result = await response.json();
        console.log("Server response:", result);
      } else {
        console.error("Failed to send session data to the server");
      }
    } catch (error) {
      console.error("Error sending session data:", error);
    }
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );

  // Login component
  const LoginComponent = () => (
    <div className="flex h-screen bg-white">
      {/* Image Section - Automatically hidden on mobile */}
      {showImage && (
        <div className="w-1/2 relative">
          <img
            src="../market.jpg"
            alt="auth illustration"
            className="w-full h-full object-scale-down"
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
              {isSignUp
                ? verificationStep === "initial"
                  ? "Create Account"
                  : "Verify Your Email"
                : "Welcome Back"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp
                ? verificationStep === "initial"
                  ? "Set up your new account"
                  : "Enter the verification code sent to your email"
                : "Sign in to your account"}
            </p>
          </div>

          <div className="border border-gray-200 shadow-sm p-6">
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
                {error}
              </div>
            )}

            {/* Signup or Login Form */}
            {(!isSignUp || (isSignUp && verificationStep === "initial")) && (
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

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-1 text-sm font-medium text-gray-800"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Your address"
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
            )}

            {/* Verification Code Form */}
            {isSignUp && verificationStep === "code-sent" && (
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block mb-1 text-sm font-medium text-gray-800"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    placeholder="Enter the 6-digit code"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We've sent a verification code to {tempUserData?.email}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-2 text-base font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors disabled:bg-green-300"
                  >
                    {isLoading ? "Please wait..." : "Verify Code"}
                  </button>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handleBackToSignup}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Back to signup
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-sm text-green-500 hover:text-green-700"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            {/* Auth mode toggle */}
            {verificationStep === "initial" && (
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
            )}
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
        {/* Show loading overlay when generating recommendations */}
        {isGeneratingRecommendations && <LoadingOverlay />}

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
                  <Home recommendations={recommendations} />
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
            path="/search"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-6">
                  <SearchPage />
                </div>
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
