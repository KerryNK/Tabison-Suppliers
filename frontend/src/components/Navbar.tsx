import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { cn } from '../utils';

// Icons (you can replace these with actual icon components)
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LogoIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#1D6D73"/>
    <path d="M8 12h16M8 16h12M8 20h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const navItems = [
  { label: 'Products', path: '/products' },
  { label: 'Suppliers', path: '/suppliers' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <RouterLink 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <LogoIcon />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Tabison</span>
              <span className="text-xs text-gray-500 leading-none">Suppliers</span>
            </div>
          </RouterLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <RouterLink
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#1D6D73] relative",
                  isActivePath(item.path) 
                    ? "text-[#1D6D73]" 
                    : "text-gray-600"
                )}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#1D6D73] rounded-full" />
                )}
              </RouterLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <RouterLink 
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-[#1D6D73] transition-colors"
                >
                  <CartIcon />
                </RouterLink>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#1D6D73] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-20 truncate">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </span>
                  </button>

                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      {/* Menu */}
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          {user?.role && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#1D6D73]/10 text-[#1D6D73] text-xs rounded-full">
                              {user.role}
                            </span>
                          )}
                        </div>
                        
                        <div className="py-1">
                          <RouterLink 
                            to="/settings" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Settings
                          </RouterLink>
                          <RouterLink 
                            to="/orders" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            My Orders
                          </RouterLink>
                          <RouterLink 
                            to="/favorites" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Favorites
                          </RouterLink>
                          {user?.role === 'admin' && (
                            <RouterLink 
                              to="/admin/products" 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Admin Dashboard
                            </RouterLink>
                          )}
                        </div>
                        
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-4">
              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <RouterLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-4 py-2 text-base font-medium transition-colors rounded-lg",
                      isActivePath(item.path)
                        ? "text-[#1D6D73] bg-[#1D6D73]/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </RouterLink>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="border-t border-gray-100 pt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    {/* User Info */}
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    {/* Quick Links */}
                    <RouterLink 
                      to="/cart" 
                      className="px-4 py-2 text-base text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      Cart
                    </RouterLink>
                    <RouterLink 
                      to="/orders" 
                      className="px-4 py-2 text-base text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </RouterLink>
                    <RouterLink 
                      to="/settings" 
                      className="px-4 py-2 text-base text-gray-600 hover:text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </RouterLink>
                    
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-base text-red-600 hover:text-red-700 text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        navigate('/register');
                        setIsOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
