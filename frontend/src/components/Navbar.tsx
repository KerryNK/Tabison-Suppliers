import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCartIcon, Bell, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const { state, dispatch } = useApp();

  const toggleMenu = () => {
    dispatch({ type: 'TOGGLE_MENU' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <img
                className="h-8 w-auto"
                src="/assets/logo.jpg"
                alt="Tabison Suppliers"
              />
            </Link>
          </div>

          {/* Center section - Search (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 justify-center px-2">
            <div className="max-w-lg w-full">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {state.user ? (
              <>
                <Link
                  to="/cart"
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {state.cart.items.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-brand-teal rounded-full">
                      {state.cart.items.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="p-2 text-gray-400 hover:text-gray-500 relative ml-4"
                >
                  <Bell className="h-6 w-6" />
                  {state.notifications.unread > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-brand-teal rounded-full">
                      {state.notifications.unread}
                    </span>
                  )}
                </Link>
                <div className="ml-4 relative flex-shrink-0">
                  <div>
                    <button
                      type="button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={state.user.avatar || '/assets/default-avatar.png'}
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-teal hover:bg-brand-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-teal bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - visible on mobile only */}
      <div className="lg:hidden border-t border-gray-200 p-4">
        <div className="max-w-lg w-full mx-auto">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
