import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  SettingsIcon,
  ChevronDownIcon,
  LogOutIcon,
  ShoppingCartIcon,
  TruckIcon,
  ClipboardListIcon,
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { state } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/products', label: 'Products', icon: ShoppingBagIcon },
    { path: '/cart', label: 'Cart', icon: ShoppingCartIcon, auth: true },
    { path: '/orders', label: 'Orders', icon: TruckIcon, auth: true },
    { path: '/wishlist', label: 'Wishlist', icon: HeartIcon, auth: true },
    { path: '/quotes', label: 'Quotes', icon: ClipboardListIcon, auth: true },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/settings', label: 'Settings' },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-brand-teal text-white'
                : 'text-gray-700 hover:bg-gray-100'
            } ${item.auth && !state.user ? 'hidden' : ''}`
          }
        >
          {item.icon && <item.icon className="w-5 h-5 mr-3" />}
          {item.label}
        </NavLink>
      ))}

      {state.user?.role === 'admin' && (
        <div className="mt-8">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500">Admin</div>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-teal text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      {state.user && (
        <div className="mt-8">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500">Account</div>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-teal text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <UserIcon className="w-5 h-5 mr-3" />
            Profile
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-teal text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <SettingsIcon className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
