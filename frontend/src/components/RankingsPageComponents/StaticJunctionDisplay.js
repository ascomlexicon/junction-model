import React from 'react';
import styles from './StaticJunctionDisplay.module.css'; 

function StaticJunctionDisplay({ outgoingDirection1, outgoingDirection2, outgoingDirection3, values }) {
  return (
    <div className={styles.junctionDisplay}>
      <div className={styles.incomingSection}>
        <h3 className={styles.directionHeading}>Entering</h3>
        <div className={styles.staticDisplay}>{values.enter} vehicles</div>
      </div>

      <div className={styles.outgoingSection}>
        {[outgoingDirection1, outgoingDirection2, outgoingDirection3].map((direction) => (
          <div key={direction} className={styles.directionDisplay}>
            <span className={styles.labelText}>Exit {direction}:</span>
            <div className={styles.staticDisplay}>
              {values['exit' + direction.charAt(0).toUpperCase() + direction.slice(1)]} vehicles
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaticJunctionDisplay;
