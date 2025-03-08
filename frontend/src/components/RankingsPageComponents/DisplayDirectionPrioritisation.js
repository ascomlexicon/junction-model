import React from 'react';
import styles from './DisplayDirectionPrioritisation.module.css';

function DisplayDirectionPrioritisation({ enablePrioritisation, directions }) {
  return (
    <div className={styles.directionPrioritisationContainer}>
      <h2>Direction Prioritisation</h2>

      {enablePrioritisation ? (
        <div className={styles.staticData}>
          <h3>Priority Order</h3>
          <ul className={styles.directionsList}>
            {directions.map((direction, index) => (
              <li key={direction.id} className={styles.directionItem}>
                <span>{index + 1}. {direction.charAt(0).toUpperCase() + direction.slice(1)}</span>
              </li>
            ))}
          </ul>
          <p className={styles.subjectToChange}>Priority is subject to change based on traffic conditions.</p>
        </div>
      ) : (
        <p className={styles.noPrioritisation}>No direction prioritisation</p>
      )}
    </div>
  );
}

export default DisplayDirectionPrioritisation;
