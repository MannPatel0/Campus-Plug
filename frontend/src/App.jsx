import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Selling from './pages/Selling';
import Transactions from './pages/Transactions';
import Favorites from './pages/Favorites';
import ProductDetail from './pages/ProductDetail';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // UI state for login/signup form
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ucid: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [error, setError] = useState('');

  // Fake users database
  const fakeUsers = [
    { email: 'john1@ucalgary.ca', password: 'password123', name: 'John Doe' },
    { email: 'jane@ucalgary.ca', password: 'password456', name: 'Jane Smith' }
  ];
  
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
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear any error when user starts typing again
    if (error) setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate email and password
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    
    if (isSignUp) {
      // Handle Sign Up
      console.log('Sign Up Form Data:', formData);
      
      // Simulate saving new user to database
      const newUser = {
        name: formData.name,
        email: formData.email,
        ucid: formData.ucid,
        phone: formData.phone
      };
      
      // Set authenticated user
      setUser(newUser);
      setIsAuthenticated(true);
      
      console.log('New user registered:', newUser);
    } else {
      // Handle Login
      console.log('Login Attempt:', { email: formData.email, password: formData.password });
      
      // Check against fake user database
      const foundUser = fakeUsers.find(
        user => user.email === formData.email && user.password === formData.password
      );
      
      if (foundUser) {
        // Set authenticated user
        setUser({
          name: foundUser.name,
          email: foundUser.email
        });
        setIsAuthenticated(true);
        console.log('Login successful for:', foundUser.name);
      } else {
        setError('Invalid email or password');
        console.log('Login failed: Invalid credentials');
      }
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    console.log('User logged out');
    
    // Reset form data
    setFormData({
      name: '',
      ucid: '',
      email: '',
      phone: '',
      password: '',
    });
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(''); // Clear errors when switching modes
    
    // Reset form data when switching modes
    setFormData({
      name: '',
      ucid: '',
      email: '',
      phone: '',
      password: '',
    });
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
      <div className={`${showImage ? 'w-1/2' : 'w-full'} bg-white p-8 flex items-center justify-center`}>
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp ? 'Set up your new account' : 'Sign in to your account'}
            </p>
          </div>

          <div className="border border-gray-200 shadow-sm p-6">
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Name field - only for signup */}
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-800">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required={isSignUp}
                  />
                </div>
              )}

              {isSignUp && (
                <div>
                  <label htmlFor="ucid" className="block mb-1 text-sm font-medium text-gray-800">
                    UCID
                  </label>
                  <input
                    type="text"
                    id="ucid"
                    value={formData.ucid}
                    onChange={handleInputChange}
                    placeholder="1234567"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@ucalgary.ca"
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
              
              {isSignUp && (
                <div>
                  <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-800">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1(123)456 7890"
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-green-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-2 text-base font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button 
                  onClick={toggleAuthMode}
                  className="text-green-500 font-medium hover:text-green-700"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
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
        {isAuthenticated && <Navbar onLogout={handleLogout} userName={user?.name} />}
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
                <LoginComponent />
            } 
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
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;