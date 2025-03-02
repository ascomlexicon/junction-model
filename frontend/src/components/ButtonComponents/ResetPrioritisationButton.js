import React from 'react';
import './ButtonComponents.css';
import ResetButton from './ResetButton';

// Reset Lane Changes Button - Specific for lane customization reset
export const ResetPrioritisationButton = ({ onClick }) => {
    return (
      <ResetButton 
        onClick={onClick} 
        label="Reset Lane Prioritisation" 
        variant="prioritisation"
      />
    );
  };

  export default ResetPrioritisationButton;