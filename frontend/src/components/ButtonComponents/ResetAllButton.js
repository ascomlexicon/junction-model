import React from 'react';
import './ButtonComponents.css';

export const ResetAllButton = ({ onConfirm, label = "Reset All" }) => {
  const handleClick = () => {
    const userConfirmed = window.confirm("Are you sure you want to reset all data?");
    if (userConfirmed) {
      onConfirm();
    }
  };

  return (
    <button 
      className="reset-all-button"
      onClick={handleClick}
      type="button"
      aria-label="Reset all form data"
    >
      {label}
    </button>
  );
};

export default ResetAllButton;

