import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// requiredRoles: array or string of allowed roles
const ProtectedRoute = ({ component: Component, requiredRoles, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        user && (
          (Array.isArray(requiredRoles)
            ? requiredRoles.includes(user.role)
            : user.role === requiredRoles)
        ) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;