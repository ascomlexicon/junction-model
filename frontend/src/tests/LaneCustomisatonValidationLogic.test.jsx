jest.mock('lucide-react', () => ({
    Info: () => <svg data-testid="info-icon" />,  
    AlertCircle: () => <svg data-testid="alert-icon" />
  }));
  
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import LaneCustomisation from '../components/MainPageComponents/LaneCustomisation.js';