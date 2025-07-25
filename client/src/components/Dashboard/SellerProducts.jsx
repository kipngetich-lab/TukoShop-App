import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useHistory, Link } from 'react-router-dom';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/mine');
      setProducts(res.data);
    } catch{ 
      setError('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Product deleted');
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md my-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">My Products</h2>
        <Link to="/seller/products/add" className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700">Add Product</Link>
      </div>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">You have no products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Approved</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {products.map(product => (
                <tr key={product._id} className="border-b border-gray-300 dark:border-gray-700">
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{product.quantity}</td>
                  <td className="py-2 px-4">{product.approved ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => history.push(`/seller/products/edit/${product._id}`)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;