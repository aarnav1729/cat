import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react'; // Update
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

// Auth0 configuration
const domain = "dev-f6hwpovky1p3rld7.us.auth0.com";
const clientId = "6UjxOq9MZZM6LLgkaBZlSML6JJOd7dYR";
const clientSecret = "m-RHtC3XXdFFzxSQOS05naSk6vWWPF37CZbWXqnjL97QASTBzXdlgcPNQ-GoaEO5";

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Protect the dashboard route */}
          <Route path="/dashboard" element={withAuthenticationRequired(Dashboard)} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

export default App;