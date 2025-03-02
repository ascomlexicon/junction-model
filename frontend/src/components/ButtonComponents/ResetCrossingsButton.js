import React from 'react';
import './ButtonComponents.css';
import ResetButton from './ResetButton';

// Reset Lane Changes Button - Specific for lane customization reset
export const ResetCrossingsButton = ({ onClick }) => {
    return (
      <ResetButton 
        onClick={onClick} 
        label="Reset Pedestrian Crossings" 
        variant="crossings"
      />
    );
  };

  export default ResetCrossingsButton;