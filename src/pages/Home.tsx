import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Users, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getItems, getClaims } from '../utils/storage';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const items = getItems();
  const claims = getClaims();
  
  const availableItems = items.filter(item => item.status === 'available');
  const recentItems = items.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">🐻</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to <span className="text-orange-400">Bear Tracks</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Bridgeland High School's Lost & Found System
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              Helping our Bear community reunite with their lost belongings. 
              Report found items, search for lost belongings, and connect with fellow students and staff.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/browse" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Search size={20} />
              <span>Browse Lost Items</span>
            </Link>
            {isAuthenticated ? (
              <Link 
                to="/submit" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Report Found Item</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Users size={20} />
                <span>Login to Get Started</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-xl bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{availableItems.length}</h3>
              <p className="text-gray-600 font-medium">Items Available</p>
            </div>
            
            <div className="p-8 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{claims.filter(c => c.status === 'pending').length}</h3>
              <p className="text-gray-600 font-medium">Pending Claims</p>
            </div>
            
            <div className="p-8 rounded-xl bg-green-50 border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{items.filter(i => i.status === 'claimed').length}</h3>
              <p className="text-gray-600 font-medium">Items Returned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      {recentItems.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recently Found Items</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Check out the latest items that have been found and turned in by our caring Bear community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {item.photos.length > 0 && (
                    <div className="h-48 bg-gray-200">
                      <img 
                        src={item.photos[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Found: {new Date(item.dateFound).toLocaleDateString()}</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/browse" 
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                View All Items
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Bear Tracks Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our simple process makes it easy to help reunite lost items with their owners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Report Found Items</h3>
              <p className="text-gray-600">
                Found something? Take a photo and submit it with details about where and when you found it.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Search & Browse</h3>
              <p className="text-gray-600">
                Lost something? Browse our database of found items and use filters to find your belongings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Claim Your Item</h3>
              <p className="text-gray-600">
                Found your item? Submit a claim request and pick it up from the main office during school hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;