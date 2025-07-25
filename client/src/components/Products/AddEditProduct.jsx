import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useHistory, useParams } from 'react-router-dom';

const AddEditProduct = () => {
  const { id } = useParams(); // If id present => edit mode
  const history = useHistory();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    images: [''],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(Boolean(id));

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          setLoadingProduct(true);
          const res = await api.get(`/products/${id}`);
          const p = res.data;
          setForm({
            name: p.name,
            description: p.description || '',
            price: p.price.toString(),
            quantity: p.quantity.toString(),
            category: p.category,
            images: p.images.length > 0 ? p.images : [''],
          });
        } catch {
          setError('Failed to load product');
        } finally {
          setLoadingProduct(false);
        }
      }
      fetchProduct();
    }
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onImageChange = (index, value) => {
    setForm(f => {
      const images = [...f.images];
      images[index] = value;
      return { ...f, images };
    });
  };

  const addImageInput = () => {
    setForm(f => ({ ...f, images: [...f.images, ''] }));
  };

  const removeImageInput = (index) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.name || !form.price || !form.quantity || !form.category) {
      setError('Please fill all required fields.');
      return;
    }
    if (isNaN(parseFloat(form.price)) || isNaN(parseInt(form.quantity))) {
      setError('Price and quantity must be numbers.');
      return;
    }
    if (form.images.some(img => !img.trim())) {
      setError('Please provide valid image URLs or remove empty fields.');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await api.put(`/products/${id}`, {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          images: form.images.filter(i => i.trim()),
        });
        alert('Product updated successfully');
      } else {
        await api.post('/products', {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          images: form.images.filter(i => i.trim()),
        });
        alert('Product added successfully');
      }
      history.push('/seller/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return <div className="p-4 text-gray-700 dark:text-gray-300">Loading product...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md my-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        {id ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Product Name *</label>
          <input
            name="name"
            id="name"
            type="text"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            id="description"
            rows="3"
            value={form.description}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="price" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Price (USD) *</label>
          <input
            name="price"
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
          <input
            name="quantity"
            id="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Category *</label>
          <input
            name="category"
            id="category"
            type="text"
            value={form.category}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="e.g. Electronics, Furniture, Food"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Image URLs *</label>
          {form.images.map((img, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="url"
                value={img}
                onChange={e => onImageChange(index, e.target.value)}
                required
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageInput(index)}
                  className="ml-2 text-red-600 hover:text-red-800 font-bold"
                  aria-label="Remove Image URL"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageInput}
            className="mt-2 text-indigo-600 hover:underline"
          >
            + Add another image URL
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 px-4 disabled:opacity-50"
        >
          {loading ? 'Saving...' : id ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddEditProduct;