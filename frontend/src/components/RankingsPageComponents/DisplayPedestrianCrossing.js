import React from 'react';
import styles from './DisplayPedestrianCrossing.module.css';

function DisplayPedestrianCrossing({ formData = {} }) {
  // Default pedestrian crossing data
  const defaultData = {
    addCrossings: false,
    crossingDuration: '',
    requestsPerHour: '',
  };

  // Merge formData with defaults to ensure compatibility
  const crossingData = { ...defaultData, ...formData };

  return (
    <div className={styles.pedestrianCrossingsContainer}>
      <h2>Pedestrian Crossings</h2>

      {crossingData.addCrossings ? (
        <div className={styles.staticData}>
          <p><strong>Crossing Duration:</strong> {crossingData.crossingDuration} seconds</p>
          <p><strong>Requests per Hour:</strong> {crossingData.requestsPerHour}</p>
        </div>
      ) : (
        <p className={styles.noCrossing}>No pedestrian crossing.</p>
      )}
    </div>
  );
}

export default DisplayPedestrianCrossing;
