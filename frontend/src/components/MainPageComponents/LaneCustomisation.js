import React, { useState, useEffect } from 'react';
import { Info, AlertCircle } from 'lucide-react';
import './LaneCustomisation.css';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import BackButton from '../ButtonComponents/BackButton';
import ResetLaneChangesButton from '../ButtonComponents/ResetLaneChangesButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';

const LaneCustomisation = ({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) => {
  // Initialize state with passed formData or default values
  const [laneData, setLaneData] = useState(() => {
    let busCycleLaneDuration = {
      vphSpecialNorth: 0,
      vphSpecialSouth: 0,
      vphSpecialEast: 0,
      vphSpecialWest: 0,
    };

    let leftTurnLanes = {
      north: false,
      south: false,
      east: false,
      west: false,
    };

    if (formData.isBusOrCycle === 'bus' || formData.isBusOrCycle === 'cycle') {
      busCycleLaneDuration = formData.busCycleLaneDuration;
    }

    if (formData.leftTurnLanes) {
      leftTurnLanes = {
        north: formData.leftTurnLanes.north,
        south: formData.leftTurnLanes.south,
        east: formData.leftTurnLanes.east,
        west: formData.leftTurnLanes.west,
      };
    }

    return {
      entering: {
        north: (formData.lanesEntering && formData.lanesEntering['north']) || '',
        south: (formData.lanesEntering && formData.lanesEntering['south']) || '',
        east: (formData.lanesEntering && formData.lanesEntering['east']) || '',
        west: (formData.lanesEntering && formData.lanesEntering['west']) || '',
      },
      exiting: {
        north: (formData.lanesExiting && formData.lanesExiting['north']) || '',
        south: (formData.lanesExiting && formData.lanesExiting['south']) || '',
        east: (formData.lanesExiting && formData.lanesExiting['east']) || '',
        west: (formData.lanesExiting && formData.lanesExiting['west']) || '',
      },
      leftTurn: leftTurnLanes,
      busCycleLaneDuration: busCycleLaneDuration,
      busLane: {
        north: busCycleLaneDuration.vphSpecialNorth > 0 && formData.isBusOrCycle === 'bus',
        south: busCycleLaneDuration.vphSpecialSouth > 0 && formData.isBusOrCycle === 'bus',
        east: busCycleLaneDuration.vphSpecialEast > 0 && formData.isBusOrCycle === 'bus',
        west: busCycleLaneDuration.vphSpecialWest > 0 && formData.isBusOrCycle === 'bus',
      },
      cycleLane: {
        north: busCycleLaneDuration.vphSpecialNorth > 0 && formData.isBusOrCycle === 'cycle',
        south: busCycleLaneDuration.vphSpecialSouth > 0 && formData.isBusOrCycle === 'cycle',
        east: busCycleLaneDuration.vphSpecialEast > 0 && formData.isBusOrCycle === 'cycle',
        west: busCycleLaneDuration.vphSpecialWest > 0 && formData.isBusOrCycle === 'cycle',
      },
    };
  });

  const [isValid, setIsValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEnteringTooltip, setShowEnteringTooltip] = useState(false);
  const [showExitingTooltip, setShowExitingTooltip] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  
  // Track left-turning traffic from each direction
  const [leftTurningTraffic, setLeftTurningTraffic] = useState({
    north: false,
    south: false,
    east: false,
    west: false,
  });

  useEffect(() => {
    validateLanes();
    checkLeftTurningTraffic();
  }, [laneData.entering, laneData.exiting]);
  
  // Function to check if there is left-turning traffic from each direction
  const checkLeftTurningTraffic = () => {
    // FIXME: Why is north true?
    const leftTurns = {
      north: true,
      south: hasLeftTurningTraffic('south'),
      east: hasLeftTurningTraffic('east'),
      west: hasLeftTurningTraffic('west'),
    };
    
    setLeftTurningTraffic(leftTurns);
    
    // Reset any left turn lanes or special lanes if there's left turning traffic in that direction
    Object.keys(leftTurns).forEach(direction => {
      if (leftTurns[direction] && (laneData.leftTurn[direction] || laneData.busLane[direction] || laneData.cycleLane[direction])) {
        setLaneData(prev => ({
          ...prev,
          leftTurn: {
            ...prev.leftTurn,
            [direction]: false,
          },
          busLane: {
            ...prev.busLane,
            [direction]: false,
          },
          cycleLane: {
            ...prev.cycleLane,
            [direction]: false,
          },
          busCycleLaneDuration: {
            ...prev.busCycleLaneDuration,
            [`vphSpecial${direction.charAt(0).toUpperCase() + direction.slice(1)}`]: 0,
          },
        }));
      }
    });
  };
  
  // Helper function to determine if there's left-turning traffic from a direction
  const hasLeftTurningTraffic = (direction) => {
    if (!formData || !formData[`vph${direction.charAt(0).toUpperCase() + direction.slice(1)}`]) {
      return false;
    }
    
    const trafficData = formData[`vph${direction.charAt(0).toUpperCase() + direction.slice(1)}`];
    
    // Map directions to their left turn exits
    const leftTurnMap = {
      north: 'exitWest',
      south: 'exitEast',
      east: 'exitNorth',
      west: 'exitSouth',
    };
    
    // Check if trafficData is an array
    if (Array.isArray(trafficData)) {
      return trafficData.some(entry => 
        entry[leftTurnMap[direction]] && entry[leftTurnMap[direction]] > 0
      );
    } 
    // If it's an object with values
    else if (typeof trafficData === 'object' && trafficData !== null) {
      // Check if any value in the object represents left turning traffic
      return Object.values(trafficData).some(entry => 
        entry && typeof entry === 'object' && 
        entry[leftTurnMap[direction]] && entry[leftTurnMap[direction]] > 0
      );
    }
    
    return false;
  };

  function calculateExitLanes(direction) {
    // Initialize array to store how many lanes turn into our target direction from each other direction
    let lanesFlowingTo = []
    
    // For each of the other 3 directions
    ["north", "south", "east", "west"].forEach(entryDirection => {
        // Skip if this is the same as our exit direction (can't enter and exit same direction)
        if (entryDirection === direction) {
          return;
        };
        
        // Get how many lanes from this entry turn toward our exit direction
        // We need to map the relationship (e.g., traffic from west turning "north")
        if (direction == "north") {
          // Calculates number of cars going FROM entryDirection TO North
          lanesFromThisEntry = calculateLanesTurningNorth(entryDirection)
        } else if (direction == "south") {
          // TODO: Do other functions if we aren't going to generalise
          lanesFromThisEntry = calculateLanesTurningSouth(entryDirection)
        } else if (direction == "east") {
          lanesFromThisEntry = calculateLanesTurningEast(entryDirection)
        } else {
          lanesFromThisEntry = calculateLanesTurningWest(entryDirection)
        };
            
        // Add to our array
        lanesFlowingTo.push(lanesFromThisEntry);
    });
    
    // Return the maximum number of lanes turning into this direction
    return Math.max(...lanesFlowingTo, 1); // Use 0 as fallback if array is empty
  }

  // Helper function example for one direction
  function calculateLanesTurningNorth(fromDirection) {
    // Get number of entry lanes in the fromDirection
    const entryLanes = laneData.entering[fromDirection]
    
    // Get the traffic distribution for this entry
    const trafficFlow = formData[`vph${fromDirection.charAt(0).toUpperCase() + fromDirection.slice(1)}`];

    // If no traffic exits north, then no lanes are needed for this fromDirection, so return 0
    if (!trafficFlow.exitNorth) {
      return 0;
    };

    switch (fromDirection) {
      case 'south':
        // If we go from south to north, all lanes are utilised as straight
        return entryLanes;
      case 'west':
        if (trafficFlow.exitEast) {
          // Traffic flows to east (straight), hence only 1 northbound lane
          return 1;
        } else if (!trafficFlow.exitSouth) {
          // Traffic flows only to the north
          return entryLanes;
        } else {
          // Traffic flows north and south only
          switch (entryLanes) {
            case 1:
              return 1;
            case 2:
              return 1;
            case 3:
              return 2;
            case 4:
              return 2;
            case 5:
              // TODO: Check how the configurations have been setup with the graphics
              return 3;
          }
        }
      case 'east':
        if (trafficFlow.exitWest) {
          // Traffic flows to west (straight), hence only 1 northbound lane
          return 1;
        } else if (!trafficFlow.exitSouth) {
          // Traffic flows only to the north
          return entryLanes;
        } else {
          // Traffic flows north and south only
          switch (entryLanes) {
            case 1:
              return 1;
            case 2:
              return 1;
            case 3:
              return 2;
            case 4:
              return 2;
            case 5:
              // TODO: Check how the configurations have been setup with the graphics
              return 3;
          }
        }
      default:
        break;
    }
  } 


  const validateLanes = () => {
    const directions = ['north', 'south', 'east', 'west'];

    directions.array.forEach(dir => {
      let res = calculateExitLanes(dir);
      // Check that res <= the value entered by the user; return false if not
      // TODO: Not sure of the best way to do this
      if (res > laneData.exiting[dir]) {
        setIsValid(false);
        return;
      }
    });
  }

  const handleInputChange = (type, direction, value) => {
    // Ensure the value doesn't exceed 5
    const numValue = parseInt(value) || 0;
    const limitedValue = numValue > 5 ? '5' : value;

    setLaneData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [direction]: limitedValue,
      },
    }));
  };

  const handleLeftTurnChange = (direction) => {
    // Check if there's left-turning traffic in this direction
    if (leftTurningTraffic[direction]) {
      setWarningMessage(`Cannot add a left turn lane for ${direction} direction. There is already traffic turning left in the Traffic Flow settings. Please remove the left turn traffic first.`);
      setShowWarning(true);
      return;
    }
    
    setLaneData((prev) => ({
      ...prev,
      leftTurn: {
        ...prev.leftTurn,
        [direction]: !prev.leftTurn[direction],
      },
    }));
  };

  const handleSpecialLaneChange = (type, direction) => {
    // Check if there's left-turning traffic in this direction
    if (leftTurningTraffic[direction]) {
      setWarningMessage(`Cannot add a ${type === 'busLane' ? 'bus' : 'cycle'} lane for ${direction} direction. There is already traffic turning left in the Traffic Flow settings. Please remove the left turn traffic first.`);
      setShowWarning(true);
      return;
    }
    
    setLaneData((prev) => {
      let newBusLane = { ...prev.busLane };
      let newCycleLane = { ...prev.cycleLane };
      let busCycleLaneDuration = { ...prev.busCycleLaneDuration };

      if (type === 'busLane') {
        if (prev.busLane[direction]) {
          busCycleLaneDuration[`vphSpecial${direction.charAt(0).toUpperCase() + direction.slice(1)}`] = 0;
        }
        newBusLane[direction] = !prev.busLane[direction];
        if (newBusLane[direction]) {
          // If bus lane is selected, clear cycle lane
          Object.keys(newCycleLane).forEach((dir) => (newCycleLane[dir] = false));
        }
      } else {
        if (prev.cycleLane[direction]) {
          busCycleLaneDuration[`vphSpecial${direction.charAt(0).toUpperCase() + direction.slice(1)}`] = 0;
        }
        newCycleLane[direction] = !prev.cycleLane[direction];
        if (newCycleLane[direction]) {
          // If cycle lane is selected, clear bus lane
          Object.keys(newBusLane).forEach((dir) => (newBusLane[dir] = false));
        }
      }

      return {
        ...prev,
        busLane: newBusLane,
        cycleLane: newCycleLane,
        busCycleLaneDuration,
      };
    });
  };

  const handleJunctionInputUpdate = (incomingDirection, value) => {
    setLaneData((prev) => ({
      ...prev,
      busCycleLaneDuration: {
        ...prev.busCycleLaneDuration,
        [`vphSpecial${incomingDirection.charAt(0).toUpperCase() + incomingDirection.slice(1)}`]: value,
      },
    }));
  };

  const hasSpecialLane = Object.entries(laneData.busLane).some(
    ([direction, value]) => value || laneData.cycleLane[direction]
  );

  const formatLaneDataToJSON = () => {
    const isBusOrCycle = (() => {
      const hasBusLane = Object.values(laneData.busLane).some((val) => val);
      const hasCycleLane = Object.values(laneData.cycleLane).some((val) => val);
      if (hasBusLane) return 'bus';
      if (hasCycleLane) return 'cycle';
      return 'none';
    })();

    const lanesEntering = {
      north: parseInt(laneData.entering.north) || 0,
      south: parseInt(laneData.entering.south) || 0,
      east: parseInt(laneData.entering.east) || 0,
      west: parseInt(laneData.entering.west) || 0,
    };

    const lanesExiting = {
      north: parseInt(laneData.exiting.north) || 0,
      south: parseInt(laneData.exiting.south) || 0,
      east: parseInt(laneData.exiting.east) || 0,
      west: parseInt(laneData.exiting.west) || 0,
    };

    return {
      leftTurnLanes: laneData.leftTurn,
      lanesEntering,
      lanesExiting,
      isBusOrCycle,
      busCycleLaneDuration: laneData.busCycleLaneDuration,
    };
  };

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

  const handleResetLaneChanges = () => {
    resetForm('laneCustomisation');
    setLaneData({
      entering: { north: '', south: '', east: '', west: '' },
      exiting: { north: '', south: '', east: '', west: '' },
      leftTurn: { north: false, south: false, east: false, west: false },
      busLane: { north: false, south: false, east: false, west: false },
      cycleLane: { north: false, south: false, east: false, west: false },
      busCycleLaneDuration: {
        vphSpecialNorth: 0,
        vphSpecialSouth: 0,
        vphSpecialEast: 0,
        vphSpecialWest: 0,
      },
    });
  };

  const closeWarning = () => {
    setShowWarning(false);
    setWarningMessage('');
  };

  return (
    <div className="lane-customization">
      <h2>Lane Customization</h2>

      {/* Warning Popup */}
      {showWarning && (
        <div className="warning-popup">
          <div className="warning-content">
            <div className="warning-header">
              <AlertCircle size={24} color="red" />
              <h4>Configuration Conflict</h4>
            </div>
            <p>{warningMessage}</p>
            <button className="close-warning" onClick={closeWarning}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Lanes Entering Section */}
      <section className="lanes-section">
        <div className="section-header">
          <h3>Lanes Entering Junction</h3>
          <div
            className="info-icon"
            onMouseEnter={() => setShowEnteringTooltip(true)}
            onMouseLeave={() => setShowEnteringTooltip(false)}
          >
            <Info size={20} />
            {showEnteringTooltip && <div className="tooltip">Maximum of 5 lanes per direction</div>}
          </div>
        </div>
        {Object.keys(laneData.entering).map((direction) => (
          <div key={`entering-${direction}`} className="input-group">
            <label>From {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
            <input
              type="number"
              value={laneData.entering[direction]}
              onChange={(e) => handleInputChange('entering', direction, e.target.value)}
              className={`lane-input ${isValid ? 'valid' : 'invalid'}`}
              min="0"
              max="5"
            />
          </div>
        ))}
      </section>

      {/* Lanes Exiting Section */}
      <section className="lanes-section">
        <div className="section-header">
          <h3>Lanes Exiting Junction</h3>
          <div
            className="info-icon"
            onMouseEnter={() => setShowExitingTooltip(true)}
            onMouseLeave={() => setShowExitingTooltip(false)}
          >
            <Info size={20} />
            {showExitingTooltip && <div className="tooltip">Maximum of 5 lanes per direction</div>}
          </div>
        </div>
        {Object.keys(laneData.exiting).map((direction) => (
          <div key={`exiting-${direction}`} className="input-group">
            <label>To {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
            <input
              type="number"
              value={laneData.exiting[direction]}
              onChange={(e) => handleInputChange('exiting', direction, e.target.value)}
              className={`lane-input ${isValid ? 'valid' : 'invalid'}`}
              min="0"
              max="5"
            />
          </div>
        ))}
      </section>

      {/* Left Turn Section */}
      <section className="left-turn-section">
        <h3>Left Turn Lanes</h3>
        {Object.keys(laneData.leftTurn).map((direction) => (
          <div key={`left-turn-${direction}`} className="checkbox-group">
            <label className={leftTurningTraffic[direction] ? 'disabled-option' : ''}>
              <input
                type="checkbox"
                checked={laneData.leftTurn[direction]}
                onChange={() => handleLeftTurnChange(direction)}
                disabled={leftTurningTraffic[direction]}
              />
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
              {leftTurningTraffic[direction] && (
                <span className="disabled-label"> (Left-turning traffic exists)</span>
              )}
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
                Only one type of special lane (bus or cycle) can be selected per direction.
                Cannot be added where left-turning traffic exists.
              </div>
            )}
          </div>
        </div>
        <div className="special-lanes-grid">
          <div className="special-lanes-column">
            <h4>Bus Lanes</h4>
            {Object.keys(laneData.busLane).map((direction) => (
              <div key={`bus-${direction}`} className="checkbox-group">
                <label className={leftTurningTraffic[direction] ? 'disabled-option' : ''}>
                  <input
                    type="checkbox"
                    checked={laneData.busLane[direction]}
                    onChange={() => handleSpecialLaneChange('busLane', direction)}
                    disabled={leftTurningTraffic[direction]}
                  />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  {leftTurningTraffic[direction] && (
                    <span className="disabled-label"> (Left-turning traffic exists)</span>
                  )}
                </label>
              </div>
            ))}
          </div>
          <div className="special-lanes-column">
            <h4>Cycle Lanes</h4>
            {Object.keys(laneData.cycleLane).map((direction) => (
              <div key={`cycle-${direction}`} className="checkbox-group">
                <label className={leftTurningTraffic[direction] ? 'disabled-option' : ''}>
                  <input
                    type="checkbox"
                    checked={laneData.cycleLane[direction]}
                    onChange={() => handleSpecialLaneChange('cycleLane', direction)}
                    disabled={leftTurningTraffic[direction]}
                  />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  {leftTurningTraffic[direction] && (
                    <span className="disabled-label"> (Left-turning traffic exists)</span>
                  )}
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
            {Object.keys(laneData.busLane).map((direction) => {
              if (laneData.busLane[direction] || laneData.cycleLane[direction]) {
                return (
                  <div key={`special-lane-${direction}`} className="input-group">
                    <label>VPH for {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
                    <input
                      type="number"
                      value={laneData.busCycleLaneDuration[`vphSpecial${direction.charAt(0).toUpperCase() + direction.slice(1)}`]}
                      onChange={(e) => handleJunctionInputUpdate(direction, e.target.value)}
                      className="lane-input"
                    />
                  </div>
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