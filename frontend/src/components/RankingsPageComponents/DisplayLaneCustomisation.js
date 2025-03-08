import React from 'react';
import styles from './DisplayLaneCustomisation.module.css';

const DisplayLaneCustomisation = ({ entering, exiting, leftTurn, busOrCycle, specialLanes, busCycleLaneDuration }) => {
  return (
    <div className={styles.laneCustomisation}>
      <h2 className={styles.laneCustTitle}>Lane Customisation</h2>

      {/* Lanes Entering Section */}
      <section className={styles.lanesSection}>
        <h3>Lanes Entering Junction</h3>
        <div className={styles.grid}>
          {Object.keys(entering).map((direction) => (
            <div key={`entering-${direction}`} className={styles.inputGroup}>
              <label className={styles.label}>From {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
              <span className={styles.staticData}>{entering[direction]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Lanes Exiting Section */}
      <section className={styles.lanesSection}>
        <h3>Lanes Exiting Junction</h3>
        <div className={styles.grid}>
          {Object.keys(exiting).map((direction) => (
            <div key={`exiting-${direction}`} className={styles.inputGroup}>
              <label className={styles.label}>To {direction.charAt(0).toUpperCase() + direction.slice(1)}:</label>
              <span className={styles.staticData}>{exiting[direction]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Left Turn Section */}
      <section className={styles.leftTurnSection}>
        {Object.values(leftTurn).some(value => value) ? (
          <>
            <h3>Left Turn Lanes</h3>
            <div className={styles.grid}>
              {Object.keys(leftTurn).map((direction) => (
                <div key={`left-turn-${direction}`} className={styles.checkboxGroup}>
                  <label>
                    <input type="checkbox" checked={leftTurn[direction]} disabled />
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.noSpecial} style={{padding: '10px'}}>No left turn lanes</div>
        )}
      </section>

      {/* Bus/Cycle Lanes Section (leftTurnSection is for styling) */}
      <section className={styles.specialLanesSection}>
        {busOrCycle === 'bus' ? (
          <>
            <h3>Bus Lanes</h3>
            <div className={styles.grid}>
              {Object.keys(specialLanes).map((direction) => (
                <div key={`bus-${direction}`} className={styles.checkboxGroup}>
                  <label>
                    <input type="checkbox" checked={specialLanes[direction]} disabled />
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.specialDurations}>
              <h3>Bus Lane Durations</h3>
              {Object.keys(busCycleLaneDuration).map((direction) => (
                <div key={`specialVPH-${direction}`} className={styles.inputGroup}>
                  <label className={styles.label}>From {direction.charAt(0) + direction.slice(1).toLowerCase()}: {busCycleLaneDuration[direction]} buses</label>
                </div>
              ))}
            </div>
          </>
        ) : busOrCycle === 'cycle' ? (
          <>
            <h3>Cycle Lanes</h3>
            <div className={styles.grid}>
              {Object.keys(specialLanes).map((direction) => (
                <div key={`cycle-${direction}`} className={styles.checkboxGroup}>
                  <label>
                    <input type="checkbox" checked={specialLanes[direction]} disabled />
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.specialDurations}>
              <h3>Cycle Lane Durations</h3>
              {Object.keys(busCycleLaneDuration).map((direction) => (
                <div key={`specialVPH-${direction}`} className={styles.inputGroup}>
                  <label className={styles.label}>From {direction.charAt(0) + direction.slice(1).toLowerCase()}: {busCycleLaneDuration[direction]} bikes</label>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className={styles.noSpecial}>No bus/cycle lanes configured</p>
        )}
      </section>
    </div>
  );
};

export default DisplayLaneCustomisation;
