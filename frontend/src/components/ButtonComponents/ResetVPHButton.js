import React from 'react';
import './ButtonComponents.css';
import ResetButton from './ResetButton';

// Reset VPH Data Button - Specific for traffic flow reset
export const ResetVPHButton = ({ onClick }) => {
    return (
      <ResetButton 
        onClick={onClick} 
        label="Reset VPH Data" 
        variant="vph"
      />
    );
  };

  export default ResetVPHButton;