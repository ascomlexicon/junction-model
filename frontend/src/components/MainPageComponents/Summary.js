import React from 'react';
import './Summary.css';
import BackButton from '../ButtonComponents/BackButton';
import { useNavigate } from 'react-router-dom';

function Summary({ formData, setActiveStep }) {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // TODO: Set API endpoint URL
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Optionally, handle the returned data:
      // TODO: This is only for testing
      const result = await response.json();
      console.log('Simulation result:', result);
      
      // TODO: Will probably have an intermediate page which is a loading screen
      navigate('/RankingsPage');
    } catch (error) {
      console.error('Error sending JSON data:', error);
    }

    navigate('/RankingsPage');
  };
  
  const handleBack = () => {
    setActiveStep(3); // Go back to DirectionPrioritisation
  };

  // Calculate total vehicles per hour for traffic flow summary
  const calculateTotalVPH = () => {
    return formData.vphNorth.enter + formData.vphSouth.enter + formData.vphEast.enter + formData.vphWest.enter;
  };
  
  return (
    <div className="summary-container">
      <h2>Junction Configuration Summary</h2>

      <div className="summary-section">
        <h3>Traffic Flow</h3>
        <div className="summary-content">
          <h4>Total Traffic Volume: {calculateTotalVPH()} vehicles per hour</h4>
          
          <div className="traffic-flow-grid">
            {Object.entries({north: formData.vphNorth, south: formData.vphSouth, east: formData.vphEast, west: formData.vphWest}).map(([direction, data]) => (
              <div key={`traffic-${direction}`} className="traffic-flow-direction">
                <h4>{direction.charAt(0).toUpperCase() + direction.slice(1)} Incoming Traffic</h4>
                <ul>
                  {Object.entries(data)
                    .filter(([key, _]) => key !== 'entry' && key.startsWith('exit'))
                    .map(([exitKey, value]) => {
                      const outDir = exitKey.replace('exit', '').toLowerCase();
                      return (
                        <li key={`${direction}-to-${outDir}`}>
                          To {outDir.charAt(0).toUpperCase() + outDir.slice(1)}: {value} vehicles/hour
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="summary-section">
        <h3>Lane Configuration</h3>
        {Object.keys(formData.lanesEntering || {}).length > 0 ? (
          <div className="summary-content">
            <h4>Entering Lanes</h4>
            <ul>
              {Object.entries(formData.lanesEntering).map(([direction, count]) => (
                <li key={`entering-${direction}`}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}: {count || 0}
                </li>
              ))}
            </ul>
            
            <h4>Exiting Lanes</h4>
            <ul>
              {Object.entries(formData.lanesExiting).map(([direction, count]) => (
                <li key={`exiting-${direction}`}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}: {count || 0}
                </li>
              ))}
            </ul>
            
            <h4>Left Turn Lanes</h4>
            <ul>
              {Object.entries(formData.leftTurnLanes).map(([direction, enabled]) => (
                <li key={`leftTurn-${direction}`}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}: {enabled ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
            
            <h4>Bus/Cycle Lanes</h4>
              {formData.isBusOrCycle === "none" && (
                <>
                  <p>No bus/cycle lanes</p>
                </>
              )}
              {formData.isBusOrCycle !== "none" && (
                <>
                  <p>Bus or Cycle: {formData.isBusOrCycle.toUpperCase()}</p>
                  <ul>
                    {Object.entries({
                      north: formData.busCycleLaneDuration.vphSpecialNorth, 
                      south: formData.busCycleLaneDuration.vphSpecialSouth, 
                      east: formData.busCycleLaneDuration.vphSpecialEast, 
                      west: formData.busCycleLaneDuration.vphSpecialWest
                    }).map(([direction, value]) => (
                      value > 0 && (
                        <li key={`busCycle-${direction}`}>
                          {direction.charAt(0).toUpperCase() + direction.slice(1)}: {value} vehicles/hour
                        </li>
                      )
                    ))}
                  </ul>
                </>
              )}
          </div>
        ) : (
          <p className="no-data">No lane configuration data</p>
        )}
      </div>
      
      <div className="summary-section">
        <h3>Pedestrian Crossings</h3>
        <div className="summary-content">
          <p>Pedestrian Crossings: {formData.isCrossings ? 'Enabled' : 'Disabled'}</p>
          
          {formData.isCrossings && (
            <>
              <p>Crossing Duration: {formData.crossingDuration} seconds</p>
              <p>Requests Per Hour: {formData.crossingRequestsPerHour}</p>
            </>
          )}
        </div>
      </div>
      
      <div className="summary-section">
        <h3>Direction Prioritisation</h3>
        <div className="summary-content">
          <p>Direction Prioritisation: {formData.enablePrioritisation ? 'Enabled' : 'Disabled'}</p>
          
          {formData.enablePrioritisation && (
            <>
              <p>Priority Order (highest to lowest):</p>
              <ol>
                {formData.directionPrioritisation.map((direction, index) => (
                  <li key={`priority-${index}`}>{direction}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
      
      <div className="button-container">
        <BackButton onClick={handleBack} label="Back to Direction Prioritisation" />
        <button className="simulate-button" onClick={handleClick}>Run Simulation</button>
      </div>
    </div>
  );
}

export default Summary;