import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';

const Signup = () => {
  const { signup } = useAuth();
  const history = useHistory();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await signup({
        username: form.username,
        password: form.password,
        role: form.role,
      });
      setSuccessMsg("Signup successful! Please login.");
      setTimeout(() => {
        history.push('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Signup</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {successMsg && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMsg}</div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;