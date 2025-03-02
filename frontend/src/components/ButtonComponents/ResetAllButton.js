import React from 'react';
import './ButtonComponents.css';

// Reset All Button - Resets all data across forms
export const ResetAllButton = ({ onClick, label = "Reset All" }) => {
    return (
      <button 
        className="reset-all-button"
        onClick={onClick}
        type="button"
        aria-label="Reset all form data"
      >
        {label}
      </button>
    );
  };

  export default ResetAllButton;