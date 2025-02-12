import React, { useState } from 'react';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import ConfigurableParameters from './ConfigurableParameters';
import { Link } from "react-router-dom";

const JunctionRankings = () => {
  const [selectedJunction, setSelectedJunction] = useState(null);
  
  const junctions = [
    { name: 'Junction 2', score: 79, highlight: true },
    { name: 'Junction 1', score: 75, highlight: false },
    { name: 'Bus Lane Junction', score: 70, highlight:false },
    { name: 'Pedestrian Crossing Junction', score: 57,highlight:false },
    { name: 'Junction 3', score: 23, highlight:false }
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h1 className={styles.title}>Junction Rankings</h1>
        <p className={styles.subtitle}>Click on a score to see how it was calculated</p>
        
        <JunctionList 
          junctions={junctions}
          onSelect={setSelectedJunction}
        />
        
        <button className={styles.backButton}>
          <Link to ="/MainPage">Back to Junction Configuration Menu</Link>
        </button>
      </div>
      
      <div className={styles.rightPanel}>
        {selectedJunction && (
          <>
            <ScoreBreakdown junctionName={selectedJunction.name} score={selectedJunction.score} />
            <ConfigurableParameters />
          </>
        )}
      </div>
    </div>
  );
};

export default JunctionRankings;