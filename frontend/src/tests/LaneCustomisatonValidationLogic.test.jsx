jest.mock('lucide-react', () => ({
    Info: () => <svg data-testid="info-icon" />,  
    AlertCircle: () => <svg data-testid="alert-icon" />
  }));
  
import { within } from '@testing-library/react';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LaneCustomisation from '../components/MainPageComponents/LaneCustomisation.js';

// Mock button components
jest.mock('../components/ButtonComponents/SaveNextButton.js', () => ({ onClick, disabled }) => (
  <button data-testid="save-next-button" onClick={onClick} disabled={disabled}>
    Save & Next
  </button>
));

jest.mock('../components/ButtonComponents/BackButton.js', () => ({ onClick, label }) => (
  <button data-testid="back-button" onClick={onClick}>
    {label}
  </button>
));

jest.mock('../components/ButtonComponents/ResetLaneChangesButton.js', () => ({ onClick }) => (
  <button data-testid="reset-lane-button" onClick={onClick}>
    Reset Lane Changes
  </button>
));

jest.mock('../components/ButtonComponents/ResetAllButton.js', () => ({ onClick }) => (
  <button data-testid="reset-all-button" onClick={onClick}>
    Reset All
  </button>
));

// Mock lucide-react already provided in the prompt

describe('LaneCustomisation Component', () => {
  const mockSetActiveStep = jest.fn();
  const mockSaveFormData = jest.fn();
  const mockResetForm = jest.fn();
  const mockResetAllForms = jest.fn();
  
  // Sample traffic flow data with left-turning traffic
  const mockFormDataWithLeftTurns = {
    vphNorth: [
      {
        exitSouth: 300,
        exitEast: 200,  // Left turn from North
        exitWest: 100
      }
    ],
    vphSouth: [
      {
        exitNorth: 300,
        exitEast: 100,
        exitWest: 200   // Left turn from South
      }
    ],
    vphEast: [
      {
        exitNorth: 100,
        exitSouth: 200, // Left turn from East
        exitWest: 300
      }
    ],
    vphWest: [
      {
        exitNorth: 200, // Left turn from West
        exitSouth: 100,
        exitEast: 300
      }
    ],
    lanesEntering: {
      north: 2,
      south: 2,
      east: 2,
      west: 2
    },
    lanesExiting: {
      north: 2,
      south: 2,
      east: 2,
      west: 2
    }
  };
  
  // Modified mock traffic flow without left-turning traffic
  const mockFormDataNoLeftTurns = {
    vphNorth: [
      {
        exitSouth: 500,
        exitEast: 0,  // No left turn
        exitWest: 100
      }
    ],
    vphSouth: [
      {
        exitNorth: 500,
        exitEast: 100,
        exitWest: 0   // No left turn
      }
    ],
    vphEast: [
      {
        exitNorth: 100,
        exitSouth: 0, // No left turn
        exitWest: 500
      }
    ],
    vphWest: [
      {
        exitNorth: 0, // No left turn
        exitSouth: 100,
        exitEast: 500
      }
    ],
    lanesEntering: {
      north: 2,
      south: 2,
      east: 2,
      west: 2
    },
    lanesExiting: {
      north: 2,
      south: 2,
      east: 2,
      west: 2
    }
  };
  const setupComponent = (formData = {}) => {
    return render(
      <LaneCustomisation
        setActiveStep={mockSetActiveStep}
        saveFormData={mockSaveFormData}
        resetForm={mockResetForm}
        resetAllForms={mockResetAllForms}
        formData={formData}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with correct title', () => {
    setupComponent();
    expect(screen.getByText('Lane Customisation')).toBeInTheDocument();
  });

  test('input validation: restricts input to max 5 lanes', async () => {
    setupComponent();
    
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    
    // Attempt to enter value greater than 5
    fireEvent.change(northEnteringInput, { target: { value: '7' } });
    
    // Value should be limited to 5
    await waitFor(() => {
      expect(northEnteringInput.value).toBe('5');
    });
  });

  test('input validation: restricts input to min 0 lanes', async () => {
    setupComponent();
    
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    
    // Attempt to enter negative value
    fireEvent.change(northEnteringInput, { target: { value: '-2' } });
    
    // Value should be limited to 0
    await waitFor(() => {
      expect(northEnteringInput.value).toBe('0');
    });
  });

  test('validates lane configuration and enables/disables Save & Next button', async () => {
    setupComponent();
    
    // Initially the button should be disabled
    expect(screen.getByTestId('save-next-button')).toBeDisabled();

    // Set valid lane configuration
    // First set entering lanes
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    const southEnteringInput = screen.getByLabelText(/From South:/i);
    const eastEnteringInput = screen.getByLabelText(/From East:/i);
    const westEnteringInput = screen.getByLabelText(/From West:/i);
    
    fireEvent.change(northEnteringInput, { target: { value: '2' } });
    fireEvent.change(southEnteringInput, { target: { value: '2' } });
    fireEvent.change(eastEnteringInput, { target: { value: '2' } });
    fireEvent.change(westEnteringInput, { target: { value: '2' } });
    
    // Then set exiting lanes
    const northExitingInput = screen.getByLabelText(/To North:/i);
    const southExitingInput = screen.getByLabelText(/To South:/i);
    const eastExitingInput = screen.getByLabelText(/To East:/i);
    const westExitingInput = screen.getByLabelText(/To West:/i);
    
    fireEvent.change(northExitingInput, { target: { value: '2' } });
    fireEvent.change(southExitingInput, { target: { value: '2' } });
    fireEvent.change(eastExitingInput, { target: { value: '2' } });
    fireEvent.change(westExitingInput, { target: { value: '2' } });
    
    // Button should now be enabled
    await waitFor(() => {
      expect(screen.getByTestId('save-next-button')).not.toBeDisabled();
    });
  });

  test('Save & Next button calls the correct functions', async () => {
    setupComponent(mockFormDataWithLeftTurns);
    
    // Set valid lane configuration
    const inputs = [
      screen.getByLabelText(/From North:/i),
      screen.getByLabelText(/From South:/i),
      screen.getByLabelText(/From East:/i),
      screen.getByLabelText(/From West:/i),
      screen.getByLabelText(/To North:/i),
      screen.getByLabelText(/To South:/i),
      screen.getByLabelText(/To East:/i),
      screen.getByLabelText(/To West:/i)
    ];
    
    inputs.forEach(input => {
      fireEvent.change(input, { target: { value: '2' } });
    });
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByTestId('save-next-button')).not.toBeDisabled();
    });
    
    // Click the Save & Next button
    fireEvent.click(screen.getByTestId('save-next-button'));
    
    // Verify the correct functions were called
    expect(mockSaveFormData).toHaveBeenCalledWith('laneCustomisation', expect.any(Object));
    expect(mockSetActiveStep).toHaveBeenCalledWith(2);
  });

  test('Back button calls setActiveStep with 0', () => {
    setupComponent();
    
    fireEvent.click(screen.getByTestId('back-button'));
    
    expect(mockSetActiveStep).toHaveBeenCalledWith(0);
  });

  test('Reset Lane Changes button resets form correctly', () => {
    setupComponent();
    
    // Set some values first
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    fireEvent.change(northEnteringInput, { target: { value: '3' } });
    
    // Click reset button
    fireEvent.click(screen.getByTestId('reset-lane-button'));
    
    // Check if resetForm function was called
    expect(mockResetForm).toHaveBeenCalledWith('laneCustomisation');
    
    // Input should be reset
    expect(northEnteringInput.value).toBe('');
  });

  test('Reset All button calls resetAllForms', () => {
    setupComponent();
    
    fireEvent.click(screen.getByTestId('reset-all-button'));
    
    expect(mockResetAllForms).toHaveBeenCalled();
  });

  test('Left turn lane checkbox is disabled when there is no left-turning traffic', async () => {
    setupComponent(mockFormDataNoLeftTurns);
    
    // Set lane configuration
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    fireEvent.change(northEnteringInput, { target: { value: '3' } });
    
    // Try to check left turn lane checkbox - using a more specific selector
    // Find the checkbox within the left-turn-section
    const leftTurnSection = screen.getByText('Left Turn Lanes').closest('section');
    const northLeftTurnCheckbox = within(leftTurnSection).getByLabelText(/North/i);
    
    fireEvent.click(northLeftTurnCheckbox);
    
    // Warning should appear
    await waitFor(() => {
      expect(screen.getByText(/Cannot add a left turn lane for north direction/i)).toBeInTheDocument();
    });
  });

  test('Special lane checkbox is disabled when there is left-turning traffic', async () => {
    setupComponent(mockFormDataWithLeftTurns);
    
    // Set lane configuration
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    fireEvent.change(northEnteringInput, { target: { value: '3' } });
    
    // Find the Bus Lanes section and the North checkbox within it
    const busLaneHeading = screen.getByText('Bus Lanes');
    const busLaneColumn = busLaneHeading.closest('.special-lanes-column');
    const northBusCheckbox = within(busLaneColumn).getByLabelText(/North/i);
    
    // Click on the checkbox (not the text)
    fireEvent.click(northBusCheckbox);
    
    // Warning should appear
    await waitFor(() => {
      expect(screen.getByText(/Cannot add a bus lane for north direction/i)).toBeInTheDocument();
    });
  });

  test('Special lane requires minimum 2 entry lanes', async () => {
    setupComponent(mockFormDataNoLeftTurns);
    
    // Set lane configuration with only 1 lane
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    fireEvent.change(northEnteringInput, { target: { value: '1' } });
    
    // Find the Bus Lanes section and the North checkbox within it
    const busLaneHeading = screen.getByText('Bus Lanes');
    const busLaneColumn = busLaneHeading.closest('.special-lanes-column');
    const northBusCheckbox = within(busLaneColumn).getByLabelText(/North/i);
    
    // Click on the checkbox
    fireEvent.click(northBusCheckbox);
    
    // Warning should appear
    await waitFor(() => {
      expect(screen.getByText(/Cannot add a bus lane for north direction. At least 2 entry lanes are required/i)).toBeInTheDocument();
    });
  });

  test('Left turn lane requires minimum 2 entry lanes', async () => {
    setupComponent(mockFormDataWithLeftTurns);
    
    // Set lane configuration with only 1 lane
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    fireEvent.change(northEnteringInput, { target: { value: '1' } });
    
    // Find the left turn section and the North checkbox within it
    const leftTurnSection = screen.getByText('Left Turn Lanes').closest('section');
    const northLeftTurnCheckbox = within(leftTurnSection).getByLabelText(/North/i);
    
    // Click on the checkbox
    fireEvent.click(northLeftTurnCheckbox);
    
    // Warning should appear
    await waitFor(() => {
      expect(screen.getByText(/Cannot add a left turn lane for north direction. At least 2 entry lanes are required/i)).toBeInTheDocument();
    });
  });

  test('Junction input fields appear only when special lanes are selected', async () => {
    setupComponent(mockFormDataNoLeftTurns);
    
    // Initially, junction input should be disabled
    expect(screen.getByText(/Select a bus or cycle lane to configure traffic flow/i)).toBeInTheDocument();
    
    // Set sufficient lanes
    const northEnteringInput = screen.getByLabelText(/From North:/i);
    fireEvent.change(northEnteringInput, { target: { value: '3' } });
    
    // Find the Bus Lanes section and the North checkbox within it
    const busLaneHeading = screen.getByText('Bus Lanes');
    const busLaneColumn = busLaneHeading.closest('.special-lanes-column');
    const northBusCheckbox = within(busLaneColumn).getByLabelText(/North/i);
    
    // Click on the checkbox
    fireEvent.click(northBusCheckbox);
    
    // Junction input field should now be visible
    await waitFor(() => {
      expect(screen.getByText(/VPH for North:/i)).toBeInTheDocument();
    });
  });
});