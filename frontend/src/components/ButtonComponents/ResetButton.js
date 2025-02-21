import React from 'react';
import './ButtonComponents.css';

// Reset Button - Resets data for current form
export const ResetButton = ({ onClick, label = "Reset", variant = "default" }) => {
  return (
    <button 
      className={`reset-button ${variant}`}
      onClick={onClick}
      type="button"
      aria-label="Reset form data"
    >
      {label}
    </button>
  );
};

export default ResetButton;