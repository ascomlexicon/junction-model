import React, { useState, useEffect } from 'react';
import JunctionInput from './JunctionInput';
import { Info } from 'lucide-react';
import './LaneCustomisation.css';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import BackButton from '../ButtonComponents/BackButton';
import ResetLaneChangesButton from '../ButtonComponents/ResetLaneChangesButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';

const LaneCustomisation = ({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) => {
  // Initialize state with passed formData or default values
  const [laneData, setLaneData] = useState(() => {
    return Object.keys(formData).length > 0 ? formData : {
      entering: {
        north: '',
        south: '',
        east: '',
        west: ''
      },
      exiting: {
        north: '',
        south: '',
        east: '',
        west: ''
      },
      leftTurn: {
        north: false,
        south: false,
        east: false,
        west: false
      },
      busLane: {
        north: false,
        south: false,
        east: false,
        west: false
      },
      cycleLane: {
        north: false,
        south: false,
        east: false,
        west: false
      },
      specialLaneFlow: {} // New state for special lane traffic flow
    };
    // if (formData.isBusOrCycle == "bus" || formData.isBusOrCycle == "cycle") {
    //   let busCycleLaneDuration = [];
    //   if (formData.busCycleLaneDuration) {
    //     busCycleLaneDuration = formData.busCycleLaneDuration;
    //   }
    // }

  });

  const [isValid, setIsValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    validateLanes();
  }, [laneData.entering, laneData.exiting]);

  const validateLanes = () => {
    const totalEntering = Object.values(laneData.entering).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0
    );
    const totalExiting = Object.values(laneData.exiting).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0
    );
    setIsValid(totalEntering === totalExiting && totalEntering > 0);
  };

  const handleInputChange = (type, direction, value) => {
    setLaneData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [direction]: value
      }
    }));
  };

  const handleLeftTurnChange = (direction) => {
    setLaneData(prev => ({
      ...prev,
      leftTurn: {
        ...prev.leftTurn,
        [direction]: !prev.leftTurn[direction]
      }
    }));
  };

  // FIXME: Change this so that multiple lanes of the same type can be selected
    // Eg bus lane both north, south and east
  const handleSpecialLaneChange = (type, direction) => {
    setLaneData(prev => {
      const newBusLane = prev.busLane;
      
      const newCycleLane = prev.cycleLane;

      if ((type === 'busLane' && prev.busLane[direction]) || 
          (type === 'cycleLane' && prev.cycleLane[direction])) {
        // Keep all lanes false
      } else {
        if (type === 'busLane') {
          newBusLane[direction] = true;
        } else {
          newCycleLane[direction] = true;
        }
      }

      // Clear specialLaneFlow when changing selection
      return {
        ...prev,
        busLane: newBusLane,
        cycleLane: newCycleLane,
        specialLaneFlow: {}
      };
    });
  };

  // Get the currently selected special lane direction
  const getSelectedDirection = () => {
    const busLaneDirection = Object.entries(laneData.busLane).find(([_, value]) => value)?.[0];
    const cycleLaneDirection = Object.entries(laneData.cycleLane).find(([_, value]) => value)?.[0];
    return busLaneDirection || cycleLaneDirection;
  };

  // Handle JunctionInput updates
  const handleJunctionInputUpdate = (flows) => {
    setLaneData(prev => ({
      ...prev,
      specialLaneFlow: flows
    }));
  };

  // Generate remaining directions based on selected direction
  const getRemainingDirections = (selectedDirection) => {
    const allDirections = ['north', 'south', 'east', 'west'];
    return allDirections.filter(dir => dir !== selectedDirection);
  };

  const hasSpecialLane = Object.entries(laneData.busLane).some(([direction, value]) => 
    value || laneData.cycleLane[direction]
  );

  // Format lane data to match required JSON structure
  const formatLaneDataToJSON = () => {
    const directions = ['north', 'south', 'east', 'west'];
    
    // Convert to arrays in the correct order
    const leftTurnLanes = directions.map(dir => laneData.leftTurn[dir]);
    const lanesEntering = directions.map(dir => parseInt(laneData.entering[dir]) || 0);
    const lanesExiting = directions.map(dir => parseInt(laneData.exiting[dir]) || 0);
    
    // Determine if bus or cycle lane is selected
    const isBusOrCycle = (() => {
      const hasBusLane = Object.values(laneData.busLane).some(val => val);
      const hasCycleLane = Object.values(laneData.cycleLane).some(val => val);
      if (hasBusLane) return "bus";
      if (hasCycleLane) return "cycle";
      return "none";
    })();

    // Calculate bus/cycle lane durations
    const busCycleLaneDuration = directions.map(dir => {
      if (laneData.busLane[dir] || laneData.cycleLane[dir]) {
        // Get the total flow from specialLaneFlow if it exists
        const flow = Object.values(laneData.specialLaneFlow)
          .reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        return flow || 0;
      }
      return 0;
    });

    return {
      leftTurnLanes,
      lanesEntering,
      lanesExiting,
      isBusOrCycle,
      busCycleLaneDuration
    };
  };

  // Handle button click events
  const handleSaveNext = () => {
    if (isValid) {
      const formattedData = formatLaneDataToJSON();
      saveFormData('laneCustomisation', formattedData);
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  // TODO: Change this with respect to new JSON structure
  const handleResetLaneChanges = () => {
    resetForm('laneCustomisation');
    setLaneData({
      entering: { north: '', south: '', east: '', west: '' },
      exiting: { north: '', south: '', east: '', west: '' },
      leftTurn: { north: false, south: false, east: false, west: false },
      busLane: { north: false, south: false, east: false, west: false },
      cycleLane: { north: false, south: false, east: false, west: false },
      specialLaneFlow: {}
    });
  };

  // Render sections...
  return (
    <div className="lane-customization">
      <h2>Lane Customization</h2>
      
      {/* Lanes Entering Section */}
      <section className="lanes-section">
        <h3>Lanes Entering Junction</h3>
        {Object.keys(laneData.entering).map(direction => (
          <div key={`entering-${direction}`} className="input-group">
            <label>From {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
            <input
              type="number"
              value={laneData.entering[direction]}
              onChange={(e) => handleInputChange('entering', direction, e.target.value)}
              className={`lane-input ${isValid ? 'valid' : 'invalid'}`}
            />
          </div>
        ))}
      </section>

      {/* Lanes Exiting Section */}
      <section className="lanes-section">
        <h3>Lanes Exiting Junction</h3>
        {Object.keys(laneData.exiting).map(direction => (
          <div key={`exiting-${direction}`} className="input-group">
            <label>To {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
            <input
              type="number"
              value={laneData.exiting[direction]}
              onChange={(e) => handleInputChange('exiting', direction, e.target.value)}
              className={`lane-input ${isValid ? 'valid' : 'invalid'}`}
            />
          </div>
        ))}
      </section>

      {/* Left Turn Section */}
      <section className="left-turn-section">
        <h3>Left Turn Lanes</h3>
        {Object.keys(laneData.leftTurn).map(direction => (
          <div key={`left-turn-${direction}`} className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={laneData.leftTurn[direction]}
                onChange={() => handleLeftTurnChange(direction)}
              />
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </label>
          </div>
        ))}
      </section>

      {/* Special Lanes Section */}
      <section className="special-lanes-section">
        <div className="special-lanes-header">
          <h3>Bus/Cycle Lanes</h3>
          <div 
            className="info-icon"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info size={20} />
            {showTooltip && (
              <div className="tooltip">
                Only one type of special lane (bus or cycle) can be selected per direction
              </div>
            )}
          </div>
        </div>
        <div className="special-lanes-grid">
          <div className="special-lanes-column">
            <h4>Bus Lanes</h4>
            {Object.keys(laneData.busLane).map(direction => (
              <div key={`bus-${direction}`} className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={laneData.busLane[direction]}
                    onChange={() => handleSpecialLaneChange('busLane', direction)}
                  />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div className="special-lanes-column">
            <h4>Cycle Lanes</h4>
            {Object.keys(laneData.cycleLane).map(direction => (
              <div key={`cycle-${direction}`} className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={laneData.cycleLane[direction]}
                    onChange={() => handleSpecialLaneChange('cycleLane', direction)}
                  />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Junction Input Section */}
      <div className={`junction-form-container ${!hasSpecialLane ? 'disabled' : ''}`}>
        {!hasSpecialLane ? (
          <div className="disabled-message">
            Select a bus or cycle lane to configure traffic flow
          </div>
        ) : (
          <div className="junction-input-wrapper">
            {(() => {
              const selectedDirection = getSelectedDirection();
              if (selectedDirection) {
                const remainingDirections = getRemainingDirections(selectedDirection);
                return (
                  <JunctionInput
                    incomingDirection={selectedDirection}
                    outgoingDirection1={remainingDirections[0]}
                    outgoingDirection2={remainingDirections[1]}
                    outgoingDirection3={remainingDirections[2]}
                    onUpdate={handleJunctionInputUpdate}
                    values={laneData.specialLaneFlow}
                  />
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>

      {/* Button container */}
      <div className="button-container">
        <BackButton onClick={handleBack} label="Back to Traffic Flow" />
        <ResetLaneChangesButton onClick={handleResetLaneChanges} />
        <ResetAllButton onClick={resetAllForms} />
        <SaveNextButton onClick={handleSaveNext} disabled={!isValid} />
      </div>
    </div>
  );
};

export default LaneCustomisation;