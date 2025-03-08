import React, { useEffect, useState } from 'react';
import styles from './VPHDisplayForm.module.css';
import StaticJunctionDisplay from './StaticJunctionDisplay';

function VPHDisplayForm({ vphData = {} }) {
  return (
    <div className={styles.formsGrid}>
      <h2>VPH Data for this Project</h2>
      <div className={styles.formCell}>
        <h1>North</h1>
        <StaticJunctionDisplay outgoingDirection1="South" outgoingDirection2="East" outgoingDirection3="West" values={vphData.vphNorth} />
      </div>
      <div className={styles.formCell}>
        <h1>South</h1>
        <StaticJunctionDisplay outgoingDirection1="North" outgoingDirection2="East" outgoingDirection3="West" values={vphData.vphSouth} />
      </div>
      <div className={styles.formCell}>
        <h1>East</h1>
        <StaticJunctionDisplay outgoingDirection1="North" outgoingDirection2="South" outgoingDirection3="West" values={vphData.vphEast} />
      </div>
      <div className={styles.formCell}>
        <h1>West</h1>
        <StaticJunctionDisplay outgoingDirection1="North" outgoingDirection2="South" outgoingDirection3="East" values={vphData.vphWest} />
      </div>
    </div>
  );
}

export default VPHDisplayForm;
