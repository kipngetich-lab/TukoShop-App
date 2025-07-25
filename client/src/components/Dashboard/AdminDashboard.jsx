import React, { useEffect, useState } from 'react';
import api from '../../api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    if (tab === 'users') fetchUsers();
    else if (tab === 'products') fetchProducts();
    else if (tab === 'orders') fetchOrders();
  }, [tab]);

  const approveProduct = async (productId) => {
    try {
      await api.post(`/admin/products/${productId}/approve`);
      alert('Product approved');
      fetchProducts();
    } catch {
      alert('Failed to approve product');
    }
  };

  const rejectProduct = async (productId) => {
    try {
      await api.post(`/admin/products/${productId}/reject`);
      alert('Product rejected');
      fetchProducts();
    } catch {
      alert('Failed to reject product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status });
      alert('Order status updated');
      fetchOrders();
    } catch {
      alert('Failed to update order status');
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md my-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
      <div className="mb-6">
        <button
          className={`mr-4 py-2 px-4 rounded ${tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => setTab('users')}
        >
          Users
        </button>
        <button
          className={`mr-4 py-2 px-4 rounded ${tab === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => setTab('products')}
        >
          Products
        </button>
        <button
          className={`py-2 px-4 rounded ${tab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {loading && <p className="text-gray-700 dark:text-gray-300">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {users.map(u => (
                <tr key={u._id} className="border-b border-gray-300 dark:border-gray-700">
                  <td className="py-2 px-4">{u.username}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td className="py-2 px-4">
                    {/* Could include deactivate/delete/etc here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Seller</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {products.map(product => (
                <tr key={product._id} className="border-b border-gray-300 dark:border-gray-700">
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.sellerUsername}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{product.quantity}</td>
                  <td className="py-2 px-4">
                    {product.approved ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    {!product.approved && (
                      <>
                        <button
                          onClick={() => approveProduct(product._id)}
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectProduct(product._id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Buyer</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Products</th>
                <th className="py-2 px-4">Update Status</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-300 dark:border-gray-700">
                  <td className="py-2 px-4">{order._id}</td>
                  <td className="py-2 px-4">{order.buyerUsername}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    <ul>
                      {order.products.map(({ product, quantity }) => (
                        <li key={product._id}>
                          {product.name} x {quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order._id, e.target.value)}
                      className="px-2 py-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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

export default AdminDashboard;