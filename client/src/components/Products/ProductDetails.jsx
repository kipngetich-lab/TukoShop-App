import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user || user.role !== 'buyer') {
      history.push('/login');
      return;
    }

    if (qty < 1 || qty > product.quantity) {
      alert('Invalid quantity');
      return;
    }

    setAddingToCart(true);
    try {
      await api.post('/cart', { productId: id, quantity: qty });
      alert('Added to cart');
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-700 dark:text-gray-300">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow-md my-4">
      <button onClick={() => history.goBack()} className="mb-4 text-indigo-600 underline">Back to products</button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img src={product.images[0]} alt={product.name} className="w-full object-cover rounded" />
          {/* Optional gallery thumbnails if multiple images */}
        </div>
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{product.name}</h1>
          <p className="text-indigo-600 text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4 text-gray-700 dark:text-gray-300"><strong>Category:</strong> {product.category}</p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{product.description || 'No description provided.'}</p>
          <p className="mb-4 text-gray-700 dark:text-gray-300"><strong>Available Quantity:</strong> {product.quantity}</p>

          {user && user.role === 'buyer' && (
            <>
              <label className="mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                min="1"
                max={product.quantity}
                value={qty}
                onChange={e => setQty(Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-1 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <button
                disabled={addingToCart}
                onClick={addToCart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </>
          )}
          {!user && (
            <p className="text-gray-700 dark:text-gray-300">Please <span className="text-indigo-600 underline cursor-pointer" onClick={() => history.push('/login')}>login</span> to buy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;