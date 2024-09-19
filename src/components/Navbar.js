import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // Redirect to the dashboard after login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-xl">CAT</h1>
        <div>
          {!isAuthenticated ? (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

