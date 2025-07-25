import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'buyer') {
      (async () => {
        setLoading(true);
        try {
          const res = await api.get('/orders');
          setOrders(res.data);
        } catch {
          setError('Failed to load orders');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user]);

  if (!user || user.role !== 'buyer') {
    return <p className="p-4 text-gray-700 dark:text-gray-300">Login as buyer to view order history.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md my-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Order History</h2>
      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border rounded p-4 dark:border-gray-700">
              <p className="mb-2 text-gray-900 dark:text-gray-100"><strong>Order ID:</strong> {order._id}</p>
              <p className="mb-4 text-gray-700 dark:text-gray-300"><strong>Status:</strong>{' '}
                <span className={
                  order.status === 'Pending' ? 'text-yellow-500' :
                  order.status === 'Shipped' ? 'text-indigo-600' :
                  'text-green-600'
                }>
                  {order.status}
                </span>
              </p>
              <div>
                {order.products.map(({ product, quantity }) => (
                  <div key={product._id} className="flex items-center space-x-4 mb-2">
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</p>
                      <p className="text-gray-700 dark:text-gray-300">Qty: {quantity}</p>
                      <p className="text-indigo-600 font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;