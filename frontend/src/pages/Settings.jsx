import { useState } from 'react';
import { User, Lock, Trash2, History, Search, Shield } from 'lucide-react';

const Settings = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    ucid: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: updated profile data to a server
    console.log('Profile updated:', userData);
    alert('Profile updated successfully!');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // TODO: validate and update password
    if (userData.newPassword !== userData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password updated');
    // Reset password fields
    setUserData(prevData => ({
      ...prevData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    alert('Password updated successfully!');
  };

  const handleDeleteHistory = (type) => {
    // TODO: Delete the specified history
    console.log(`Deleting ${type} history`);
    alert(`${type} history deleted successfully!`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      {/* Profile Information Section */}
      <div className="bg-white border border-gray-200 mb-6">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
          </div>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="ucid" className="block text-sm font-medium text-gray-700 mb-1">
                  UCID
                </label>
                <input
                  type="text"
                  id="ucid"
                  value={userData.ucid}
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
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <p className="text-sm text-gray-500">Delete all your search history on StudentMarket</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteHistory('search')}
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
                  <h3 className="font-medium text-gray-800">Browsing History</h3>
                  <p className="text-sm text-gray-500">Delete all your browsing history on StudentMarket</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteHistory('browsing')}
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
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  console.log('Account deletion requested');
                  alert('Account deletion request submitted. You will receive a confirmation email.');
                }
              }}
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