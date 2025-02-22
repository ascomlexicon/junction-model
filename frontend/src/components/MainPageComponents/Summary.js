import React from 'react';
import './Summary.css';
import BackButton from '../ButtonComponents/BackButton';
import { useNavigate } from 'react-router-dom';

function Summary({ formData, setActiveStep }) {
  const { trafficFlow, laneCustomisation, pedestrianCrossing, lanePrioritisation } = formData;
  const navigate = useNavigate();
  

  const handleClick = (e) => {
    e.preventDefault();
    // TODO: For now this just ensures form is not-empty
        // More formal validation can be added later
    navigate('/RankingsPage');
};
  
  const handleBack = () => {
    setActiveStep(3); // Go back to LanePrioritisation
  };

  // Calculate total vehicles per hour for traffic flow summary
  const calculateTotalVPH = () => {
    if (!trafficFlow || Object.keys(trafficFlow).length === 0) return 0;
    
    let total = 0;
    Object.values(trafficFlow).forEach(direction => {
      Object.values(direction).forEach(value => {
        total += parseInt(value) || 0;
      });
    });
    return total;
  };
  
  return (
    <div className="summary-container">
      <h2>Junction Configuration Summary</h2>
      
      <div className="summary-section">
        <h3>Traffic Flow</h3>
        {Object.keys(trafficFlow || {}).length > 0 ? (
          <div className="summary-content">
            <h4>Total Traffic Volume: {calculateTotalVPH()} vehicles per hour</h4>
            
            <div className="traffic-flow-grid">
              {Object.entries(trafficFlow).map(([incoming, outgoing]) => (
                <div key={`traffic-${incoming}`} className="traffic-flow-direction">
                  <h4>{incoming.charAt(0).toUpperCase() + incoming.slice(1)} Incoming Traffic</h4>
                  <ul>
                    {Object.entries(outgoing).map(([outDir, value]) => (
                      <li key={`${incoming}-to-${outDir}`}>
                        To {outDir.charAt(0).toUpperCase() + outDir.slice(1)}: {value} vehicles/hour
                      </li>
                    ))}
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