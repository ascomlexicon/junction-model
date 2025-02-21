import React, { useState } from 'react';
import './PedestrianCrossing.css';

function PedestrianCrossings() {
  const [addCrossings, setAddCrossings] = useState(false);
  const [crossingDuration, setCrossingDuration] = useState('');
  const [requestsPerHour, setRequestsPerHour] = useState('');

  return (
    <div className="pedestrian-crossings-container">
      <h2>Pedestrian Crossings</h2>
      
      <div className="info-box">
        <h3>Info:</h3>
        <ul>
          <li>Pedestrian crossings allow safe passage across the junction</li>
          <li>Adding crossings may impact traffic flow and signal timing</li>
          <li>Crossing duration affects waiting time for vehicles</li>
        </ul>
      </div>

      <div className="crossing-controls">
        <div className="control-row">
          <label htmlFor="add-crossings">
            Add Crossings:
            <input
              id="add-crossings"
              type="checkbox"
              checked={addCrossings}
              onChange={(e) => setAddCrossings(e.target.checked)}
            />
          </label>
        </div>

        {addCrossings && (
          <>
            <div className="control-row">
              <label htmlFor="crossing-duration">
                Duration of Crossings (seconds):
                <input
                  id="crossing-duration"
                  type="number"
                  min="5"
                  max="60"
                  value={crossingDuration}
                  onChange={(e) => setCrossingDuration(e.target.value)}
                />
              </label>
            </div>

            <div className="control-row">
              <label htmlFor="requests-per-hour">
                Crossing requests per hour:
                <input
                  id="requests-per-hour"
                  type="number"
                  min="0"
                  max="1000"
                  value={requestsPerHour}
                  onChange={(e) => setRequestsPerHour(e.target.value)}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PedestrianCrossings;