// LoadingSpinner.js
import React from 'react';
import './css/loadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
