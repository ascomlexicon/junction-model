import React from 'react';
import './ButtonComponents.css';
import ResetButton from './ResetButton';

// Reset Lane Changes Button - Specific for lane customization reset
export const ResetLaneChangesButton = ({ onClick }) => {
    return (
      <ResetButton 
        onClick={onClick} 
        label="Reset Lane Changes" 
        variant="lane"
      />
    );
  };

  export default ResetLaneChangesButton;