import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.get('/products', {
          params: filterCategory ? { category: filterCategory } : {}
        });
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filterCategory]);

  // Gather distinct categories for filtering
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 dark:text-gray-200">Products</h1>

      <div className="mb-4">
        <label className="mr-2 text-gray-700 dark:text-gray-300 font-medium">Filter by Category:</label>
        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          value={filterCategory}
          className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <div
              key={product._id}
              className="border rounded shadow-sm p-4 bg-white dark:bg-gray-800 flex flex-col"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-48 object-cover mb-3 rounded"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
              <p className="text-indigo-600 font-semibold text-lg mb-2">${product.price.toFixed(2)}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">Qty: {product.quantity}</p>

              {user && user.role === 'buyer' && (
                <Link
                  className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded"
                  to={`/products/${product._id}`}
                >
                  View & Buy
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;