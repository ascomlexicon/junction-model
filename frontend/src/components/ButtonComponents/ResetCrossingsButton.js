import React from 'react';
import './ButtonComponents.css';
import ResetButton from './ResetButton';

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