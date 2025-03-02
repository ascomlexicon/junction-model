import React, { useEffect, useState } from 'react';
import styles from './VPHDisplayForm.module.css'; // ✅ Import correctly
import StaticJunctionDisplay from './StaticJunctionDisplay';

// TODO: Need to pass a parameter containing the data to here instead
function VPHDisplayForm() {
  const [trafficData, setTrafficData] = useState({
    north: { south: 0, east: 0, west: 0 },
    south: { north: 0, east: 0, west: 0 },
    east: { north: 0, south: 0, west: 0 },
    west: { north: 0, south: 0, east: 0 }
  });

  useEffect(() => {
    const generateRandomData = () => ({
      north: { south: Math.floor(Math.random() * 151) + 50, east: Math.floor(Math.random() * 151) + 50, west: Math.floor(Math.random() * 151) + 50 },
      south: { north: Math.floor(Math.random() * 151) + 50, east: Math.floor(Math.random() * 151) + 50, west: Math.floor(Math.random() * 151) + 50 },
      east: { north: Math.floor(Math.random() * 151) + 50, south: Math.floor(Math.random() * 151) + 50, west: Math.floor(Math.random() * 151) + 50 },
      west: { north: Math.floor(Math.random() * 151) + 50, south: Math.floor(Math.random() * 151) + 50, east: Math.floor(Math.random() * 151) + 50 }
    });

    const savedData = localStorage.getItem('trafficData');
    if (savedData) {
      try {
        setTrafficData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing saved traffic data:', e);
        setTrafficData(generateRandomData());
      }
    } else {
      setTrafficData(generateRandomData());
    }
  }, []);

  return (
    <div className={styles.junctionDisplayContainer}> 
      <div className={styles.formsGrid}>
        <div className={styles.formCell}>
          <h1>North</h1>
          <StaticJunctionDisplay incomingDirection="North" outgoingDirection1="South" outgoingDirection2="East" outgoingDirection3="West" values={trafficData.north} />
        </div>
        <div className={styles.formCell}>
          <h1>South</h1>
          <StaticJunctionDisplay incomingDirection="South" outgoingDirection1="North" outgoingDirection2="East" outgoingDirection3="West" values={trafficData.south} />
        </div>
        <div className={styles.formCell}>
          <h1>East</h1>
          <StaticJunctionDisplay incomingDirection="East" outgoingDirection1="North" outgoingDirection2="South" outgoingDirection3="West" values={trafficData.east} />
        </div>
        <div className={styles.formCell}>
          <h1>West</h1>
          <StaticJunctionDisplay incomingDirection="West" outgoingDirection1="North" outgoingDirection2="South" outgoingDirection3="East" values={trafficData.west} />
        </div>
      </div>
    </div>
  );
}

export default VPHDisplayForm;
