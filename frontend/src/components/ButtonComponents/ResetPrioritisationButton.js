import React from 'react';
import './ButtonComponents.css';
import ResetButton from './ResetButton';

export const ResetPrioritisationButton = ({ onClick }) => {
    return (
      <ResetButton 
        onClick={onClick} 
        label="Reset Direction Prioritisation" 
        variant="prioritisation"
      />
    );
  };

  export default ResetPrioritisationButton;