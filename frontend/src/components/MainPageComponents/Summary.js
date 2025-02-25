import React from 'react';
import './Summary.css';
import BackButton from '../ButtonComponents/BackButton';
import { useNavigate } from 'react-router-dom';

// TODO: Rather than accessing from formData, try to refactor to access from JSON instead
function Summary({ completeJSON, setActiveStep }) {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // TODO: Set API endpoint URL
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeJSON)
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
    setActiveStep(3); // Go back to LanePrioritisation
  };

  // Calculate total vehicles per hour for traffic flow summary
  const calculateTotalVPH = () => {
    // FIXME: Returning undefined, not sure why
    return completeJSON.vphNorth.enter + completeJSON.vphSouth.enter + completeJSON.vphEast.enter + completeJSON.vphWest.enter;
  };
  
  return (
    <div className="summary-container">
      <h2>Junction Configuration Summary</h2>
      
      <div className="summary-section">
        <h3>Traffic Flow</h3>
        {Object.keys(completeJSON.vphNorth || {}).length > 0 ? (
          <div className="summary-content">
            <h4>Total Traffic Volume: {calculateTotalVPH()} vehicles per hour</h4>
            
            <div className="traffic-flow-grid">
              {Object.entries({north: completeJSON.vphNorth, south: completeJSON.vphSouth, east: completeJSON.vphEast, west: completeJSON.vphWest}).map(([direction, data]) => (
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
        ) : (
          <p className="no-data">No traffic flow data configured</p>
        )}
      </div>
      
      <div className="summary-section">
        <h3>Lane Configuration</h3>
        {Object.keys(laneCustomisation || {}).length > 0 ? (
          <div className="summary-content">
            <h4>Entering Lanes</h4>
            <ul>
              {Object.entries(laneCustomisation.entering).map(([direction, count]) => (
                <li key={`entering-${direction}`}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}: {count || 0}
                </li>
              ))}
            </ul>
            
            <h4>Exiting Lanes</h4>
            <ul>
              {Object.entries(laneCustomisation.exiting).map(([direction, count]) => (
                <li key={`exiting-${direction}`}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}: {count || 0}
                </li>
              ))}
            </ul>
            
            <h4>Left Turn Lanes</h4>
            <ul>
              {Object.entries(laneCustomisation.leftTurn).map(([direction, enabled]) => (
                <li key={`leftTurn-${direction}`}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}: {enabled ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
            
            <h4>Special Lanes</h4>
            <p>Bus Lanes:</p>
            <ul>
              {Object.entries(laneCustomisation.busLane).filter(([_, enabled]) => enabled).map(([direction]) => (
                <li key={`bus-${direction}`}>{direction.charAt(0).toUpperCase() + direction.slice(1)}</li>
              ))}
              {!Object.values(laneCustomisation.busLane).some(value => value) && <li>None</li>}
            </ul>
            
            <p>Cycle Lanes:</p>
            <ul>
              {Object.entries(laneCustomisation.cycleLane).filter(([_, enabled]) => enabled).map(([direction]) => (
                <li key={`cycle-${direction}`}>{direction.charAt(0).toUpperCase() + direction.slice(1)}</li>
              ))}
              {!Object.values(laneCustomisation.cycleLane).some(value => value) && <li>None</li>}
            </ul>
          </div>
        ) : (
          <p className="no-data">No lane configuration data</p>
        )}
      </div>
      
      <div className="summary-section">
        <h3>Pedestrian Crossings</h3>
        {Object.keys(pedestrianCrossing || {}).length > 0 ? (
          <div className="summary-content">
            <p>Pedestrian Crossings: {pedestrianCrossing.addCrossings ? 'Enabled' : 'Disabled'}</p>
            
            {pedestrianCrossing.addCrossings && (
              <>
                <p>Crossing Duration: {pedestrianCrossing.crossingDuration} seconds</p>
                <p>Requests Per Hour: {pedestrianCrossing.requestsPerHour}</p>
              </>
            )}
          </div>
        ) : (
          <p className="no-data">No pedestrian crossing configuration</p>
        )}
      </div>
      
      <div className="summary-section">
        <h3>Lane Prioritisation</h3>
        {Object.keys(lanePrioritisation || {}).length > 0 ? (
          <div className="summary-content">
            <p>Direction Prioritization: {lanePrioritisation.enablePrioritization ? 'Enabled' : 'Disabled'}</p>
            
            {lanePrioritisation.enablePrioritization && (
              <>
                <p>Priority Order (highest to lowest):</p>
                <ol>
                  {lanePrioritisation.directions.map((direction, index) => (
                    <li key={`priority-${index}`}>{direction.content}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        ) : (
          <p className="no-data">No lane prioritisation configured</p>
        )}
      </div>
      
      <div className="button-container">
        <BackButton onClick={handleBack} label="Back to Lane Prioritisation" />
        <button className="simulate-button" onClick={handleClick}>Run Simulation</button>
      </div>
    </div>
  );
}

export default Summary;