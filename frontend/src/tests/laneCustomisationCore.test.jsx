jest.mock('lucide-react', () => ({
    Info: () => <svg data-testid="info-icon" />,  
    AlertCircle: () => <svg data-testid="alert-icon" />
  }));
  
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import LaneCustomisation from '../components/MainPageComponents/LaneCustomisation.js';
  
  const mockSetActiveStep = jest.fn();
  const mockSaveFormData = jest.fn();
  const mockResetForm = jest.fn();
  const mockResetAllForms = jest.fn();
  
  const defaultProps = {
    setActiveStep: mockSetActiveStep,
    saveFormData: mockSaveFormData,
    resetForm: mockResetForm,
    resetAllForms: mockResetAllForms,
    formData: {
      vphNorth: { exitEast: 50, exitWest: 30 },
      vphSouth: { exitNorth: 40, exitEast: 20 },
      vphEast: { exitSouth: 60, exitWest: 25 },
      vphWest: { exitNorth: 35, exitEast: 45 },
      isBusOrCycle: 'none'
    }
  };
  
  describe('LaneCustomisation Component - Core Input Functionality', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders component with correct title and sections', () => {
      render(<LaneCustomisation {...defaultProps} />);
      expect(screen.getByText('Lane Customisation')).toBeInTheDocument();
      expect(screen.getByText('Lanes Entering Junction')).toBeInTheDocument();
      expect(screen.getByText('Lanes Exiting Junction')).toBeInTheDocument();
    });
  
    test('renders all entering lane inputs correctly', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const directions = ['North', 'South', 'East', 'West'];
      directions.forEach(direction => {
        expect(screen.getByLabelText(`From ${direction}:`)).toBeInTheDocument();
      });
    });
  
    test('renders all exiting lane inputs correctly', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const directions = ['North', 'South', 'East', 'West'];
      directions.forEach(direction => {
        expect(screen.getByLabelText(`To ${direction}:`)).toBeInTheDocument();
      });
    });
  
    test('allows entering valid values in lane inputs', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const northEnteringInput = screen.getByLabelText('From North:');
      fireEvent.change(northEnteringInput, { target: { value: '3' } });
      expect(northEnteringInput.value).toBe('3');
      
      const southExitingInput = screen.getByLabelText('To South:');
      fireEvent.change(southExitingInput, { target: { value: '2' } });
      expect(southExitingInput.value).toBe('2');
    });
  
    test('limits lane input to maximum value of 5', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const northEnteringInput = screen.getByLabelText('From North:');
      fireEvent.change(northEnteringInput, { target: { value: '6' } });
      expect(northEnteringInput.value).toBe('5');
    });
  
    test('limits lane input to minimum value of 0', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const eastExitingInput = screen.getByLabelText('To East:');
      fireEvent.change(eastExitingInput, { target: { value: '-1' } });
      expect(eastExitingInput.value).toBe('0');
    });
  
    test('handles empty input values correctly', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const westEnteringInput = screen.getByLabelText('From West:');
      fireEvent.change(westEnteringInput, { target: { value: '' } });
      expect(westEnteringInput.value).toBe('');
    });
  
    test('displays information tooltips when hovering over info icons', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const infoIcons = screen.getAllByTestId('info-icon');
      expect(infoIcons.length).toBeGreaterThan(0);
      
      // Test the first info icon tooltip
      fireEvent.mouseEnter(infoIcons[0]);
      expect(screen.getByText(/Maximum of 5 lanes per direction/i)).toBeInTheDocument();
    });
  
    test('back button returns to traffic flow step', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const backButton = screen.getByText('Back to Traffic Flow');
      fireEvent.click(backButton);
      
      expect(mockSetActiveStep).toHaveBeenCalledWith(0);
    });
  
    test('reset lane changes button calls resetForm with correct parameter', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const resetButton = screen.getByText('Reset Lane Changes');
      fireEvent.click(resetButton);
      
      expect(mockResetForm).toHaveBeenCalledWith('laneCustomisation');
    });
  
    test('reset all button calls resetAllForms', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      const resetAllButton = screen.getByText('Reset All');
      fireEvent.click(resetAllButton);
      
      expect(mockResetAllForms).toHaveBeenCalled();
    });
  
    test('form correctly processes numeric input values', () => {
      render(<LaneCustomisation {...defaultProps} />);
      
      // Set values for all entering lanes
      const directions = ['North', 'South', 'East', 'West'];
      
      directions.forEach((direction, index) => {
        const input = screen.getByLabelText(`From ${direction}:`);
        fireEvent.change(input, { target: { value: String(index + 1) } });
        expect(input.value).toBe(String(index + 1));
      });
      
      // Set values for all exiting lanes
      directions.forEach((direction, index) => {
        const input = screen.getByLabelText(`To ${direction}:`);
        fireEvent.change(input, { target: { value: String(index + 1) } });
        expect(input.value).toBe(String(index + 1));
      });
    });
  });