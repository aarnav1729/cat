import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth0();

  if (!isAuthenticated) {
    return <div>You need to log in to access the dashboard.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Welcome to your Dashboard, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <img src={user.picture} alt={user.name} className="rounded-full w-24 h-24" />
      {/* Add charts and other dashboard components here */}
    </div>
  );
};

export default Dashboard;
