import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import AddEditProduct from './components/Products/AddEditProduct';

import Cart from './components/Cart/Cart';

import OrderHistory from './components/Orders/OrderHistory';

import AdminDashboard from './components/Dashboard/AdminDashboard';
import SellerProducts from './components/Dashboard/SellerProducts';
import BuyerOrders from './components/Dashboard/BuyerOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/products" />} />
              <Route exact path="/products" component={ProductList} />
              <Route exact path="/products/:id" component={ProductDetails} />

              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />

              {/* Buyer routes */}
              <ProtectedRoute exact path="/cart" component={Cart} requiredRoles="buyer" />
              <ProtectedRoute exact path="/orders" component={OrderHistory} requiredRoles="buyer" />
              <ProtectedRoute exact path="/orders" component={BuyerOrders} requiredRoles="buyer" />

              {/* Seller routes */}
              <ProtectedRoute exact path="/seller/products" component={SellerProducts} requiredRoles="seller" />
              <ProtectedRoute exact path="/seller/products/add" component={AddEditProduct} requiredRoles="seller" />
              <ProtectedRoute exact path="/seller/products/edit/:id" component={AddEditProduct} requiredRoles="seller" />

              {/* Admin routes */}
              <ProtectedRoute exact path="/admin" component={AdminDashboard} requiredRoles="admin" />

              <Route path="*">
                <div className="text-center text-gray-700 dark:text-gray-300">
                  <h2 className="text-3xl font-semibold mt-20">404 - Page Not Found</h2>
                </div>
              </Route>
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;