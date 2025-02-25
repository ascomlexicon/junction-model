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
    let busCycleLaneDuration = [];
    let leftTurnLanes = [];

    if (formData.isBusOrCycle === "bus" || formData.isBusOrCycle === "cycle") {
      busCycleLaneDuration = formData.busCycleLaneDuration;
    } else {
      busCycleLaneDuration = [{
        "vphSpecialNorth": [],
        "vphSpecialSouth": [],
        "vphSpecialEast": [],
        "vphSpecialWest": []
      }]
    }
    
    if (formData.leftTurnLanes) {
      leftTurnLanes = formData.leftTurnLanes;
    } else {
      leftTurnLanes = {
        north: false,
        south: false,
        east: false,
        west: false
      };
    }

    console.log(busCycleLaneDuration);
    return {
      entering: {
        north: (formData.lanesEntering && formData.lanesEntering['north']) || '',
        south: (formData.lanesEntering && formData.lanesEntering['south']) || '',
        east: (formData.lanesEntering && formData.lanesEntering['east']) || '',
        west: (formData.lanesEntering && formData.lanesEntering['west']) || ''
      },
      exiting: {
        north: (formData.lanesEntering && formData.lanesExiting['north'] )|| '',
        south: (formData.lanesEntering && formData.lanesExiting['south'] )|| '',
        east: (formData.lanesEntering && formData.lanesExiting['east'] )|| '',
        west: (formData.lanesEntering && formData.lanesExiting['west'] )|| ''
      },
      leftTurn: leftTurnLanes,
      busCycleLaneDuration: busCycleLaneDuration,
      busLane: {
        north: busCycleLaneDuration[0].vphSpecialNorth.length > 0,
        south: busCycleLaneDuration[0].vphSpecialSouth.length > 0,
        east: busCycleLaneDuration[0].vphSpecialEast.length > 0,
        west: busCycleLaneDuration[0].vphSpecialWest.length > 0
      },
      cycleLane: {
        north: busCycleLaneDuration[0].vphSpecialNorth.length > 0,
        south: busCycleLaneDuration[0].vphSpecialSouth.length > 0,
        east: busCycleLaneDuration[0].vphSpecialEast.length > 0,
        west: busCycleLaneDuration[0].vphSpecialWest.length > 0
      }
    }
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

  const handleSpecialLaneChange = (type, direction) => {
    setLaneData(prev => {
      const newBusLane = { ...prev.busLane };;
      
      const newCycleLane = { ...prev.cycleLane };;

      if (type === 'busLane') {
        newBusLane[direction] = !prev.busLane[direction];
        if (newBusLane[direction]) {
          // If bus lane is selected, clear cycle lane
          Object.keys(newCycleLane).forEach(dir => newCycleLane[dir] = false);
        }
      } else {
        newCycleLane[direction] = !prev.cycleLane[direction];
        if (newCycleLane[direction]) {
          // If cycle lane is selected, clear bus lane
          Object.keys(newBusLane).forEach(dir => newBusLane[dir] = false);
        }
      }

      // Clear specialLaneFlow when changing selection
      return {
        ...prev,
        busLane: newBusLane,
        cycleLane: newCycleLane
      };
    });
  };

  // Handle JunctionInput updates
  const handleJunctionInputUpdate = (incomingDirection, flows) => {
    setLaneData(prev => ({
      ...prev,
      busCycleLaneDuration: {
        ...prev.busCycleLaneDuration,
        // Update only the selected direction with new flows
        [`vphSpecial${incomingDirection.charAt(0).toUpperCase() + incomingDirection.slice(1)}`]: flows
      }
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
    // const busCycleLaneDuration = directions.map(dir => {
    //   if (laneData.busLane[dir] || laneData.cycleLane[dir]) {
    //     // Get the total flow from specialLaneFlow if it exists
    //     const flow = Object.values(laneData.specialLaneFlow)
    //       .reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    //     return flow || 0;
    //   }
    //   return 0;
    // });

    return {
      leftTurnLanes,
      lanesEntering,
      lanesExiting,
      isBusOrCycle,
      busCycleLaneDuration: laneData.busCycleLaneDuration
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
            {Object.keys(laneData.busLane).map(direction => {
              if (laneData.busLane[direction] || laneData.cycleLane[direction]) {
                const remainingDirections = getRemainingDirections(direction);
                return (
                  <JunctionInput
                    key={`junction-input-${direction}`}
                    incomingDirection={direction}
                    outgoingDirection1={remainingDirections[0]}
                    outgoingDirection2={remainingDirections[1]}
                    outgoingDirection3={remainingDirections[2]}
                    onUpdate={(data) => handleJunctionInputUpdate(direction, data)}
                    // Pass only the data for the selected direction
                    values={laneData.busCycleLaneDuration[direction]}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
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