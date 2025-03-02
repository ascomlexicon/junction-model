import React from 'react';
import styles from './DisplayLaneCustomisation.module.css';

const DisplayLaneCustomisation = ({ entering, exiting, leftTurn, busOrCycle, busCycleDurations }) => {
  // Dummy data for display
  // const dummyData = {
  //   entering: { north: '2', south: '3', east: '1', west: '2' },
  //   exiting: { north: '2', south: '3', east: '1', west: '2' },
  //   leftTurn: { north: true, south: false, east: true, west: false },
  //   busLane: { north: true, south: false, east: true, west: false },
  //   cycleLane: { north: false, south: false, east: false, west: false },
  // };

  return (
    <div className={styles.laneCustomization}>
      <h2>Lane Customisation</h2>

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
      <section className={styles.specialLanesSection}>
        <h3>Bus & Cycle Lanes</h3>
        <div className={styles.specialLanesGrid}>
          {/* Bus Lanes */}
          <div className={styles.specialLanesColumn}>
            <h4>Bus Lanes</h4>
            {Object.keys(dummyData.busLane).map((direction) => (
              <div key={`bus-${direction}`} className={styles.checkboxGroup}>
                <label>
                  <input type="checkbox" checked={dummyData.busLane[direction]} disabled />
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {/* Cycle Lanes */}
          <div className={styles.specialLanesColumn}>
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
      </section>

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
