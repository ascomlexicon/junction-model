import React from 'react';
import styles from './DisplayLaneCustomisation.module.css';

const DisplayLaneCustomisation = ({ entering, exiting, leftTurn, busOrCycle }) => {
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
      {/* TODO: This section may not be configured by the user */}
      <section className={styles.leftTurnSection}>
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
      </section>

      {/* Bus/Cycle Lanes Section */}
      {/* TODO: Remember, only one of these can be active for the entire junction, so will need to change this logic */}
      {/* <section className={styles.specialLanesSection}>
        <h3>Bus & Cycle Lanes</h3>
        <div className={styles.specialLanesGrid}> */}
          {/* Bus Lanes */}
          {/* <div className={styles.specialLanesColumn}>
            <h4>Bus Lanes</h4>
            {Object.keys(dummyData.busLane).map((direction) => (
              <div key={`bus-${direction}`} className={styles.checkboxGroup}>
                <label>
                  <input type="checkbox" checked={dummyData.busLane[direction]} disabled />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                </label>
              </div>
            ))}
          </div> */}

          {/* Cycle Lanes */}
          {/* <div className={styles.specialLanesColumn}>
            <h4>Cycle Lanes</h4>
            {Object.keys(dummyData.cycleLane).map((direction) => (
              <div key={`cycle-${direction}`} className={styles.checkboxGroup}>
                <label>
                  <input type="checkbox" checked={dummyData.cycleLane[direction]} disabled />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {busOrCycle && (
        <>
          <h3>Bus/Cycle Lane Durations</h3>
          {/* TODO: Display the durations input by the user here */}
        </>
      )};
    </div>
  );
};

export default DisplayLaneCustomisation;
