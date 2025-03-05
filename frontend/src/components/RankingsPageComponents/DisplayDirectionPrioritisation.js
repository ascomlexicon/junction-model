import React from 'react';
import styles from './DisplayDirectionPrioritisation.module.css';

function DisplayDirectionPrioritisation({ formData = {} }) {
  // Default prioritisation data
  const defaultData = {
    enablePrioritisation: true,
    directions: [
      { id: 'north', content: 'North' },
      { id: 'south', content: 'South' },
      { id: 'east', content: 'East' },
      { id: 'west', content: 'West' }
    ]
  };

  // Merge formData with defaults to ensure compatibility
  const prioritisationData = { ...defaultData, ...formData };

  return (
    <div className={styles.directionPrioritisationContainer}>
      <h2>Direction Prioritisation</h2>

      {prioritisationData.enablePrioritisation ? (
        <div className={styles.staticData}>
          <h3>Priority Order</h3>
          <ul className={styles.directionsList}>
            {prioritisationData.directions.map((direction, index) => (
              <li key={direction.id} className={styles.directionItem}>
                <span>{index + 1}. {direction.content}</span>
              </li>
            ))}
          </ul>
          <p className={styles.subjectToChange}>Priority is subject to change based on traffic conditions.</p>
        </div>
      ) : (
        <p className={styles.noPrioritisation}>No direction prioritisation.</p>
      )}
    </div>
  );
}

export default DisplayDirectionPrioritisation;
