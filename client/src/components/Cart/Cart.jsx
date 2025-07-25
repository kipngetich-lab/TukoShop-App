import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'buyer') {
      fetchCart();
    }
  }, [user]);

  if (!user || user.role !== 'buyer') {
    return <p className="p-4 text-gray-700 dark:text-gray-300">Login as buyer to access cart.</p>;
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put('/cart', { productId, quantity });
      await fetchCart();
    } catch {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch {
      alert('Failed to remove item');
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setPlacingOrder(true);
    try {
      await api.post('/orders');
      alert('Order placed successfully');
      await fetchCart();
    } catch {
      alert('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md my-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Shopping Cart</h2>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading cart...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          <div className="divide-y divide-gray-300 dark:divide-gray-600">
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="flex items-center py-4 space-x-4">
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{product.name}</h3>
                  <p className="text-indigo-600 font-semibold">${product.price.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={e => updateQuantity(product._id, Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <button
                  onClick={() => removeItem(product._id)}
                  className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                  aria-label={`Remove ${product.name} from cart`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">Total: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded disabled:opacity-50"
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;