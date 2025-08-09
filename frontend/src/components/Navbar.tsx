import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const navItems = [
  { label: 'Products', path: '/products' },
  { label: 'Suppliers', path: '/suppliers' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const location = useLocation();
  const { isAuthenticated, userProfile, firebaseUser, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActiveLink = (path: string) => location.pathname === path;

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-brand-white shadow-sm border-b border-brand-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-brand-black">Tabison</span>
              <span className="hidden sm:inline text-sm text-gray-600 font-medium">Suppliers</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-brand-teal ${
                    isActiveLink(item.path) 
                      ? 'text-brand-teal border-b-2 border-brand-teal pb-1' 
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-brand-teal transition-colors">
                <Search size={20} />
              </button>
              
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-600 hover:text-brand-teal transition-colors"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-brand-teal text-brand-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-brand-gray-bg transition-colors"
                  >
                    {firebaseUser?.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt={firebaseUser.displayName || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {firebaseUser?.displayName || 'User'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-brand-white rounded-lg shadow-lg border border-brand-gray-light py-1">
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-gray-bg"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-gray-bg"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                      {userProfile?.role === 'admin' && (
                        <Link
                          to="/admin/products"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-gray-bg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-600 hover:text-brand-teal transition-colors text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="bg-brand-teal text-brand-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal-dark transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-brand-teal transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden animate-slide-up">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-brand-white border-t border-brand-gray-light">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-medium transition-colors hover:bg-brand-gray-bg hover:text-brand-teal rounded-md ${
                      isActiveLink(item.path) 
                        ? 'text-brand-teal bg-brand-gray-bg' 
                        : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile Actions */}
                <div className="pt-4 border-t border-brand-gray-light mt-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <Link 
                      to="/cart" 
                      className="flex items-center space-x-2 text-gray-600 hover:text-brand-teal transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart size={20} />
                      <span>Cart (0)</span>
                    </Link>
                    <button className="p-2 text-gray-600 hover:text-brand-teal transition-colors">
                      <Search size={20} />
                    </button>
                  </div>
                  
                  {isAuthenticated ? (
                    <div className="px-3 py-2 space-y-2">
                      <div className="flex items-center space-x-3 py-2">
                        {firebaseUser?.photoURL ? (
                          <img
                            src={firebaseUser.photoURL}
                            alt={firebaseUser.displayName || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-brand-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {firebaseUser?.displayName || 'User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {firebaseUser?.email}
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        to="/settings"
                        className="block w-full text-left py-2 text-gray-700 hover:text-brand-teal"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      
                      <Link
                        to="/orders"
                        className="block w-full text-left py-2 text-gray-700 hover:text-brand-teal"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      
                      {userProfile?.role === 'admin' && (
                        <Link
                          to="/admin/products"
                          className="block w-full text-left py-2 text-gray-700 hover:text-brand-teal"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="px-3 py-2 space-y-2">
                      <button
                        onClick={() => handleAuthClick('login')}
                        className="block w-full text-center py-2 text-brand-teal border border-brand-teal rounded-lg hover:bg-brand-teal hover:text-brand-white transition-colors"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleAuthClick('register')}
                        className="block w-full text-center py-2 bg-brand-teal text-brand-white rounded-lg hover:bg-brand-teal-dark transition-colors"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </>
  );
};

export default Navbar;
