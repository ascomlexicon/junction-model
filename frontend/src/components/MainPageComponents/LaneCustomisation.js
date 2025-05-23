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
        north: formData.leftTurnLanes.north || false,
        south: formData.leftTurnLanes.south || false,
        east: formData.leftTurnLanes.east || false,
        west: formData.leftTurnLanes.west || false,
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
    const leftTurns = {
      north: hasLeftTurningTraffic('north'),
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
    if (!formData) {
      return false;
    }
    
    // Check the direct VPH data for the direction (from the JSON structure)
    const trafficKey = `vph${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
    const trafficData = formData[trafficKey];
    
    if (!trafficData) {
      return false;
    }
    
    // Map directions to their left turn exits
    const leftTurnMap = {
      north: 'exitEast',
      south: 'exitWest',
      east: 'exitSouth',
      west: 'exitNorth',
    };
    
    const leftTurnKey = leftTurnMap[direction];
    
    // Handle different data structures
    if (typeof trafficData === 'object' && trafficData !== null) {
      // Handle direct object structure like in the example JSON
      if (trafficData[leftTurnKey] && trafficData[leftTurnKey] > 0) {
        return true;
      }
      
      // Handle array structure (from the original function)
      if (Array.isArray(trafficData)) {
        return trafficData.some(entry => 
          entry[leftTurnKey] && entry[leftTurnKey] > 0
        );
      }
      
      // Handle nested object structure
      return Object.values(trafficData).some(entry => 
        entry && typeof entry === 'object' && 
        entry[leftTurnKey] && entry[leftTurnKey] > 0
      );
    }
    
    return false;
  };

  // Calculates the number of exit lanes needed in the 'direction' quarter 
  // Ie if direction = north, calculating lanes exiting northbound
  function calculateExitLanes(direction) {
    // Initialize array to store how many lanes turn into our target direction from each other direction
    let lanesFlowingTo = []
    let lanesFromThisEntry = 0;
    // For each of the other 3 directions
    ["north", "south", "east", "west"].forEach(entryDirection => {
        // Skip if this is the same as our exit direction (can't enter and exit same direction)
        if (entryDirection === direction) {
          return;
        };
        
        // Get how many lanes from this entry turn toward our exit direction
        // We need to map the relationship (e.g., traffic from west turning "north")
        if (direction === "north") {
          // Calculates number of cars going FROM entryDirection TO North
          lanesFromThisEntry = calculateLanesTurningNorth(entryDirection)
        } else if (direction === "south") {
          lanesFromThisEntry = calculateLanesTurningSouth(entryDirection)
        } else if (direction === "east") {
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

  function calculateLanesTurningNorth(fromDirection) {
    // Get number of entry lanes in the fromDirection
    const entryLanes = laneData.entering[fromDirection];
    
    // Get the traffic distribution for this entry
    const trafficKey = `vph${fromDirection.charAt(0).toUpperCase() + fromDirection.slice(1)}`;
    const trafficData = formData[trafficKey];
    
    // Guard against undefined data
    if (!trafficData) {
      return 0;
    }
    
    // Check if traffic going north exists based on data structure
    let hasTrafficNorth = false;
    
    // Handle array format (like in the test data)
    if (Array.isArray(trafficData)) {
      hasTrafficNorth = trafficData.some(flow => flow.exitNorth && flow.exitNorth > 0);
    } 
    // Handle direct object format
    else if (typeof trafficData === 'object') {
      hasTrafficNorth = trafficData.exitNorth && trafficData.exitNorth > 0;
    }
    
    // If no traffic exits north, then no lanes are needed for this fromDirection
    if (!hasTrafficNorth) {
      return 0;
    }
    
    // Get traffic flows to other directions similarly
    let hasTrafficEast = false;
    let hasTrafficSouth = false;
    let hasTrafficWest = false;
    
    if (Array.isArray(trafficData)) {
      hasTrafficEast = trafficData.some(flow => flow.exitEast && flow.exitEast > 0);
      hasTrafficSouth = trafficData.some(flow => flow.exitSouth && flow.exitSouth > 0);
      hasTrafficWest = trafficData.some(flow => flow.exitWest && flow.exitWest > 0);
    } else if (typeof trafficData === 'object') {
      hasTrafficEast = trafficData.exitEast && trafficData.exitEast > 0;
      hasTrafficSouth = trafficData.exitSouth && trafficData.exitSouth > 0;
      hasTrafficWest = trafficData.exitWest && trafficData.exitWest > 0;
    }
  
    switch (fromDirection) {
      case 'south':
        // If we go from south to north, all lanes are utilised as straight
        return entryLanes;
      case 'west':
        if (hasTrafficEast) {
          // Traffic flows to east (straight), hence only 1 northbound lane
          return 1;
        } else if (!hasTrafficSouth) {
          // Traffic flows only to the north
          return entryLanes;
        } else {
          // Traffic flows north and south only
          if (entryLanes <= 2) {
            return 1;
          } else {
            return 2;
          }
        }
      case 'east':
        if (hasTrafficWest) {
          // Traffic flows to west (straight), hence only 1 northbound lane
          return 1;
        } else if (!hasTrafficSouth) {
          // Traffic flows only to the north
          return entryLanes;
        } else {
          // Traffic flows north and south only
          if (entryLanes <= 3) {
            return 1;
          } else {
            return 2;
          }
        }
      default:
        return 0;
    }
  }
  
  // Similarly for the other direction calculation functions 
  function calculateLanesTurningSouth(fromDirection) {
    // Get number of entry lanes in the fromDirection
    const entryLanes = laneData.entering[fromDirection];
    
    // Get the traffic distribution for this entry
    const trafficKey = `vph${fromDirection.charAt(0).toUpperCase() + fromDirection.slice(1)}`;
    const trafficData = formData[trafficKey];
    
    // Guard against undefined data
    if (!trafficData) {
      return 0;
    }
    
    // Check if traffic going south exists based on data structure
    let hasTrafficSouth = false;
    
    // Handle array format (like in the test data)
    if (Array.isArray(trafficData)) {
      hasTrafficSouth = trafficData.some(flow => flow.exitSouth && flow.exitSouth > 0);
    } 
    // Handle direct object format
    else if (typeof trafficData === 'object') {
      hasTrafficSouth = trafficData.exitSouth && trafficData.exitSouth > 0;
    }
    
    // If no traffic exits south, then no lanes are needed for this fromDirection
    if (!hasTrafficSouth) {
      return 0;
    }
    
    // Get traffic flows to other directions similarly
    let hasTrafficEast = false;
    let hasTrafficNorth = false;
    let hasTrafficWest = false;
    
    if (Array.isArray(trafficData)) {
      hasTrafficEast = trafficData.some(flow => flow.exitEast && flow.exitEast > 0);
      hasTrafficNorth = trafficData.some(flow => flow.exitNorth && flow.exitNorth > 0);
      hasTrafficWest = trafficData.some(flow => flow.exitWest && flow.exitWest > 0);
    } else if (typeof trafficData === 'object') {
      hasTrafficEast = trafficData.exitEast && trafficData.exitEast > 0;
      hasTrafficNorth = trafficData.exitNorth && trafficData.exitNorth > 0;
      hasTrafficWest = trafficData.exitWest && trafficData.exitWest > 0;
    }
  
    // Logic for south-bound traffic similar to northbound
    switch (fromDirection) {
      case 'north':
        // If we go from north to south, all lanes are utilised as straight
        return entryLanes;
      case 'east':
        if (hasTrafficWest) {
          // Traffic flows to west (straight), hence only 1 southbound lane
          return 1;
        } else if (!hasTrafficNorth) {
          // Traffic flows only to the south
          return entryLanes;
        } else {
          // Traffic flows south and north only
          if (entryLanes <= 2) {
            return 1;
          } else {
            return 2;
          }
        }
      case 'west':
        if (hasTrafficEast) {
          // Traffic flows to east (straight), hence only 1 southbound lane
          return 1;
        } else if (!hasTrafficNorth) {
          // Traffic flows only to the south
          return entryLanes;
        } else {
          // Traffic flows south and north only
          if (entryLanes <= 3) {
            return 1;
          } else {
            return 2;
          }
        }
      default:
        return 0;
    }
  }
  
  function calculateLanesTurningEast(fromDirection) {
    // Get number of entry lanes in the fromDirection
    const entryLanes = laneData.entering[fromDirection];
    
    // Get the traffic distribution for this entry
    const trafficKey = `vph${fromDirection.charAt(0).toUpperCase() + fromDirection.slice(1)}`;
    const trafficData = formData[trafficKey];
    
    // Guard against undefined data
    if (!trafficData) {
      return 0;
    }
    
    // Check if traffic going east exists based on data structure
    let hasTrafficEast = false;
    
    // Handle array format (like in the test data)
    if (Array.isArray(trafficData)) {
      hasTrafficEast = trafficData.some(flow => flow.exitEast && flow.exitEast > 0);
    } 
    // Handle direct object format
    else if (typeof trafficData === 'object') {
      hasTrafficEast = trafficData.exitEast && trafficData.exitEast > 0;
    }
    
    // If no traffic exits east, then no lanes are needed for this fromDirection
    if (!hasTrafficEast) {
      return 0;
    }
    
    // Get traffic flows to other directions similarly
    let hasTrafficSouth = false;
    let hasTrafficNorth = false;
    let hasTrafficWest = false;
    
    if (Array.isArray(trafficData)) {
      hasTrafficSouth = trafficData.some(flow => flow.exitSouth && flow.exitSouth > 0);
      hasTrafficNorth = trafficData.some(flow => flow.exitNorth && flow.exitNorth > 0);
      hasTrafficWest = trafficData.some(flow => flow.exitWest && flow.exitWest > 0);
    } else if (typeof trafficData === 'object') {
      hasTrafficSouth = trafficData.exitSouth && trafficData.exitSouth > 0;
      hasTrafficNorth = trafficData.exitNorth && trafficData.exitNorth > 0;
      hasTrafficWest = trafficData.exitWest && trafficData.exitWest > 0;
    }
  
    // Logic for east-bound traffic
    switch (fromDirection) {
      case 'west':
        // If we go from west to east, all lanes are utilised as straight
        return entryLanes;
      case 'north':
        if (hasTrafficSouth) {
          // Traffic flows to south (straight), hence only 1 eastbound lane
          return 1;
        } else if (!hasTrafficWest) {
          // Traffic flows only to the east
          return entryLanes;
        } else {
          // Traffic flows east and west only
          if (entryLanes <= 2) {
            return 1;
          } else {
            return 2;
          }
        }
      case 'south':
        if (hasTrafficNorth) {
          // Traffic flows to north (straight), hence only 1 eastbound lane
          return 1;
        } else if (!hasTrafficWest) {
          // Traffic flows only to the east
          return entryLanes;
        } else {
          // Traffic flows east and west only
          if (entryLanes <= 3) {
            return 1;
          } else {
            return 2;
          }
        }
      default:
        return 0;
    }
  }
  
  function calculateLanesTurningWest(fromDirection) {
    // Get number of entry lanes in the fromDirection
    const entryLanes = laneData.entering[fromDirection];
    
    // Get the traffic distribution for this entry
    const trafficKey = `vph${fromDirection.charAt(0).toUpperCase() + fromDirection.slice(1)}`;
    const trafficData = formData[trafficKey];
    
    // Guard against undefined data
    if (!trafficData) {
      return 0;
    }
    
    // Check if traffic going west exists based on data structure
    let hasTrafficWest = false;
    
    // Handle array format (like in the test data)
    if (Array.isArray(trafficData)) {
      hasTrafficWest = trafficData.some(flow => flow.exitWest && flow.exitWest > 0);
    } 
    // Handle direct object format
    else if (typeof trafficData === 'object') {
      hasTrafficWest = trafficData.exitWest && trafficData.exitWest > 0;
    }
    
    // If no traffic exits west, then no lanes are needed for this fromDirection
    if (!hasTrafficWest) {
      return 0;
    }
    
    // Get traffic flows to other directions similarly
    let hasTrafficSouth = false;
    let hasTrafficNorth = false;
    let hasTrafficEast = false;
    
    if (Array.isArray(trafficData)) {
      hasTrafficSouth = trafficData.some(flow => flow.exitSouth && flow.exitSouth > 0);
      hasTrafficNorth = trafficData.some(flow => flow.exitNorth && flow.exitNorth > 0);
      hasTrafficEast = trafficData.some(flow => flow.exitEast && flow.exitEast > 0);
    } else if (typeof trafficData === 'object') {
      hasTrafficSouth = trafficData.exitSouth && trafficData.exitSouth > 0;
      hasTrafficNorth = trafficData.exitNorth && trafficData.exitNorth > 0;
      hasTrafficEast = trafficData.exitEast && trafficData.exitEast > 0;
    }
  
    // Logic for west-bound traffic
    switch (fromDirection) {
      case 'east':
        // If we go from east to west, all lanes are utilised as straight
        return entryLanes;
      case 'north':
        if (hasTrafficSouth) {
          // Traffic flows to south (straight), hence only 1 westbound lane
          return 1;
        } else if (!hasTrafficEast) {
          // Traffic flows only to the west
          return entryLanes;
        } else {
          // Traffic flows west and east only
          if (entryLanes <= 2) {
            return 1;
          } else {
            return 2;
          }
        }
      case 'south':
        if (hasTrafficNorth) {
          // Traffic flows to north (straight), hence only 1 westbound lane
          return 1;
        } else if (!hasTrafficEast) {
          // Traffic flows only to the west
          return entryLanes;
        } else {
          // Traffic flows west and east only
          if (entryLanes <= 3) {
            return 1;
          } else {
            return 2;
          }
        }
      default:
        return 0;
    }
  }

  const validateLanes = () => {
    let flag = true;

    ['north', 'south', 'east', 'west'].forEach(dir => {
      let res = calculateExitLanes(dir);
      // Check that res <= the value entered by the user; return false if not
      if (res > laneData.exiting[dir]) {
        flag = false;
        return;
      }
    });

    setIsValid(flag);
  }

  const handleInputChange = (type, direction, value) => {
    // Ensure the value doesn't exceed 5 or is less than 0
    const numValue = parseInt(value) || 0;

    let limitedValue = '';
    if (numValue > 5) {
      limitedValue = '5';
    } else if (numValue < 0) {
      limitedValue = '0';
    } else {
      limitedValue = value
    };
        
    setLaneData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [direction]: limitedValue
      }
    }));
  };

  const handleLeftTurnChange = (direction) => {
    // Check if there's NO left-turning traffic in this direction
    if (!leftTurningTraffic[direction]) {
      setWarningMessage(`Cannot add a left turn lane for ${direction} direction. No left-turning traffic exists in the Traffic Flow settings. Please update the traffic flow first.`);
      setShowWarning(true);
      return;
    }

    // New constraint: Check if there are at least 2 entry lanes
    const entryLanes = parseInt(laneData.entering[direction]) || 0;
    if (entryLanes < 2) {
      setWarningMessage(`Cannot add a left turn lane for ${direction} direction. At least 2 entry lanes are required for a left turn only lane.`);
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
      setWarningMessage(`Cannot add a ${type === 'busLane' ? 'bus' : 'cycle'} lane for ${direction} direction. There is already traffic turning left in the Traffic Flow settings. Please remove the left turning traffic first.`);
      setShowWarning(true);
      return;
    }

     // New constraint: Check if there are at least 2 entry lanes
    const entryLanes = parseInt(laneData.entering[direction]) || 0;
    if (entryLanes < 2) {
      setWarningMessage(`Cannot add a ${type === 'busLane' ? 'bus' : 'cycle'} lane for ${direction} direction. At least 2 entry lanes are required for a special lane.`);
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
    <div className="lane-customisation">
      <h2>Lane Customisation</h2>

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

      <div className="info-box">
        <h3>Info:</h3>
        <ul>
          <li>Customise the number and type of lanes for each junction quarter</li>
          <li>Left turns can only be configured when there exists left turning traffic</li>
          <li>For any given junction quarter, there can be only one special lane (left turn, bus or cycle)</li>
        </ul>
      </div>

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
            {showEnteringTooltip && (
              <div className="tooltip">
                Maximum of 5 lanes per direction.
                Number of lanes exiting equal to or greater than number of lanes entering.
                Number of lanes entering includes any special lanes that are added.

              </div>
            )}
          </div>
        </div>
        {Object.keys(laneData.entering).map(direction => (
          <div key={`entering-${direction}`} className="input-group">
            <label htmlFor={`entering-${direction}`}>
              From {direction.charAt(0).toUpperCase() + direction.slice(1)}:
            </label>
            <input
              id={`entering-${direction}`}
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
            {showExitingTooltip && (
              <div className="tooltip">
                Maximum of 5 lanes per direction.
                Number of lanes exiting equal to or greater than number of lanes entering.
                Number of lanes entering includes any special lanes that are added.
              </div>
            )}
          </div>
        </div>
        {Object.keys(laneData.exiting).map(direction => (
          <div key={`exiting-${direction}`} className="input-group">
            <label htmlFor={`exiting-${direction}`}>
              To {direction.charAt(0).toUpperCase() + direction.slice(1)}:
            </label>
            <input
              id={`exiting-${direction}`}
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
        {/* TODO: add info icon */}
        <h3>Left Turn Lanes</h3>
        {Object.keys(laneData.leftTurn).map((direction) => {
          const entryLanes = parseInt(laneData.entering[direction]) || 0;
          const hasMinimumLanes = entryLanes >= 2;
          
          return (
            <div key={`left-turn-${direction}`} className="checkbox-group">
              <label 
                className={
                  (!leftTurningTraffic[direction] || !hasMinimumLanes) 
                  ? 'disabled-option' 
                  : ''
                }
              >
                <input
                  type="checkbox"
                  checked={laneData.leftTurn[direction]}
                  onChange={() => handleLeftTurnChange(direction)}
                  // disabled={!leftTurningTraffic[direction] || !hasMinimumLanes}
                />
                {direction.charAt(0).toUpperCase() + direction.slice(1)}
                {!leftTurningTraffic[direction] && (
                  <span className="disabled-label"> (No left-turning traffic exists)</span>
                )}
                {leftTurningTraffic[direction] && !hasMinimumLanes && (
                  <span className="disabled-label"> (Requires at least 2 entry lanes)</span>
                )}
              </label>
            </div>
          );
        })}
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
              <div className="special-lanes-tooltip">
                Only one type of special lane (bus or cycle) can be selected per direction.
                Cannot be added where left-turning traffic exists.
              </div>
            )}
          </div>
        </div>
        <div className="special-lanes-grid">
          <div className="special-lanes-column">
            <h4>Bus Lanes</h4>
            {Object.keys(laneData.busLane).map((direction) => {
              const entryLanes = parseInt(laneData.entering[direction]) || 0;
              const hasMinimumLanes = entryLanes >= 2;
              
              return (
                <div key={`bus-${direction}`} className="checkbox-group">
                  <label 
                    className={
                      (leftTurningTraffic[direction] || !hasMinimumLanes) 
                      ? 'disabled-option' 
                      : ''
                    }
                  >
                    <input
                      type="checkbox"
                      checked={laneData.busLane[direction]}
                      onChange={() => handleSpecialLaneChange('busLane', direction)}
                    />
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                    {leftTurningTraffic[direction] && (
                      <span className="disabled-label"> (Left-turning traffic exists.)</span>
                    )}
                    {!leftTurningTraffic[direction] && !hasMinimumLanes && (
                      <span className="disabled-label"> (Requires at least 2 entry lanes)</span>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
          <div className="special-lanes-column">
            <h4>Cycle Lanes</h4>
            {Object.keys(laneData.cycleLane).map((direction) => {
              const entryLanes = parseInt(laneData.entering[direction]) || 0;
              const hasMinimumLanes = entryLanes >= 2;
              
              return (
                <div key={`cycle-${direction}`} className="checkbox-group">
                  <label 
                    className={
                      (leftTurningTraffic[direction] || !hasMinimumLanes) 
                      ? 'disabled-option' 
                      : ''
                    }
                  >
                    <input
                      type="checkbox"
                      checked={laneData.cycleLane[direction]}
                      onChange={() => handleSpecialLaneChange('cycleLane', direction)}
                    />
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                    {leftTurningTraffic[direction] && (
                      <span className="disabled-label"> (Left-turning traffic exists.)</span>
                    )}
                    {!leftTurningTraffic[direction] && !hasMinimumLanes && (
                      <span className="disabled-label"> (Requires at least 2 entry lanes)</span>
                    )}
                  </label>
                </div>
              );
            })}
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
        <ResetAllButton onConfirm={resetAllForms} />
        <SaveNextButton onClick={handleSaveNext} disabled={!isValid} />
      </div>
    </div>
  );
};

export default LaneCustomisation;

