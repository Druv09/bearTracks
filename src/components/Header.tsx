import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Plus, Search, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/finallogo.png" alt="Bear Tracks Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Bear Tracks</h1>
              <p className="text-xs text-blue-200">Bridgeland High School</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-orange-300 transition-colors">
              Home
            </Link>
            <Link to="/browse" className="hover:text-orange-300 transition-colors flex items-center space-x-1">
              <Search size={16} />
              <span>Browse Items</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/submit" className="hover:text-orange-300 transition-colors flex items-center space-x-1">
                  <Plus size={16} />
                  <span>Submit Item</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-orange-300 transition-colors flex items-center space-x-1">
                    <Shield size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                <NotificationBell />
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span className="text-sm">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="hover:text-orange-300 transition-colors flex items-center space-x-1"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-800">
            <nav className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-300 transition-colors">
                Home
              </Link>
              <Link to="/browse" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-300 transition-colors">
                Browse Items
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/submit" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-300 transition-colors">
                    Submit Item
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-300 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <div className="py-2 border-t border-blue-800">
                    <p className="text-sm text-blue-200">Logged in as {user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="text-orange-300 hover:text-orange-400 transition-colors mt-2"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors text-center">
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;