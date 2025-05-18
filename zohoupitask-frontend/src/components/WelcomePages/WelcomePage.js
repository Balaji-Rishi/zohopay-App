// src/components/WelcomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/main');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-container">
      <div className="glass-box">
        <h1 className="glow-text">💸 Welcome to <span className="brand">ZOHO Pay</span></h1>
        <p className="fade-in delay">Secure. Simple. Swift.</p>
      </div>
    </div>
  );
}

export default WelcomePage;
