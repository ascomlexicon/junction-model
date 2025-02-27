import React from 'react';
import styles from './StaticJunctionDisplay.module.css'; // ✅ Import correctly

function StaticJunctionDisplay({ incomingDirection, outgoingDirection1, outgoingDirection2, outgoingDirection3, values }) {
  const generateRandomTraffic = () => Math.floor(Math.random() * 151) + 50;

  const displayValues = values || {
    [outgoingDirection1.toLowerCase()]: generateRandomTraffic(),
    [outgoingDirection2.toLowerCase()]: generateRandomTraffic(),
    [outgoingDirection3.toLowerCase()]: generateRandomTraffic()
  };

  const totalTraffic = Object.values(displayValues).reduce((sum, value) => sum + value, 0);

  return (
    <div className={styles.junctionDisplay}> {/* ✅ Apply CSS Module */}
      <div className={styles.incomingSection}>
        <h3 className={styles.directionHeading}>Entering</h3>
        <div className={styles.staticDisplay}>{totalTraffic} vehicles</div>
      </div>

      <div className={styles.outgoingSection}>
        {[outgoingDirection1, outgoingDirection2, outgoingDirection3].map((direction) => (
          <div key={direction} className={styles.directionDisplay}>
            <span className={styles.labelText}>Exit {direction}:</span>
            <div className={styles.staticDisplay}>
              {displayValues[direction.toLowerCase()]} vehicles
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaticJunctionDisplay;
