import React from 'react';
import './ButtonComponents.css';


// Save and Next Button - Saves current data and navigates to next step
export const SaveNextButton = ({ onClick, label = "Save and Next", disabled = false }) => {
    return (
      <button 
        className="save-next-button"
        onClick={onClick}
        type="button"
        disabled={disabled}
        aria-label="Save data and continue to next step"
      >
        {label}
        <span className="arrow-icon">→</span>
      </button>
    );
  };

  export default SaveNextButton;