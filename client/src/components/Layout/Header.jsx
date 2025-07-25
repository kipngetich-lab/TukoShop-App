import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-900 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
        <Link to="/">TukoShop</Link>
      </div>
      <nav className="space-x-4 flex items-center">
        <DarkModeToggle />
        <Link className="hover:underline text-gray-800 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400" to="/products">Products</Link>
        {user && user.role === 'seller' && (
          <Link className="hover:underline text-gray-800 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400" to="/seller/products">My Products</Link>
        )}
        {user && user.role === 'buyer' && (
          <>
            <Link className="hover:underline text-gray-800 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400" to="/cart">Cart</Link>
            <Link className="hover:underline text-gray-800 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400" to="/orders">Orders</Link>
          </>
        )}
        {user && user.role === 'admin' && (
          <Link className="hover:underline text-gray-800 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400" to="/admin">Admin Dashboard</Link>
        )}
        {user ? (
          <>
            <span className="text-gray-800 dark:text-gray-200">
              Hello, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="hover:underline px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" to="/login">Login</Link>
            <Link className="hover:underline px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition" to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;