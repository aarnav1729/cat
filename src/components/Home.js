import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome to CAT</h1>
      {!isAuthenticated && (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 text-white px-4 py-2 mt-6 rounded"
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default Home;
