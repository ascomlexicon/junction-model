import React from 'react';
import './ButtonComponents.css';

// Back Button - Returns to previous form and resets current form data
export const BackButton = ({ onClick, label = "Back to Traffic Flow" }) => {
    return (
      <button 
        className="back-button"
        onClick={onClick}
        type="button"
        aria-label="Go back to previous step"
      >
        <span className="arrow-icon">←</span>
        {label}
      </button>
    );
  };

  export default BackButton;