import React, { useState } from 'react';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import { Link } from "react-router-dom";
import VPHDisplayForm from './VPHDisplayForm';

const JunctionRankings = () => {
    // Keep track of both selected junction and junctions state
    const [selectedJunction, setSelectedJunction] = useState(null);
    const [junctions, setJunctions] = useState([
      { name: 'Junction 2', score: 79, highlight: false },
      { name: 'Junction 1', score: 75, highlight: false },
      { name: 'Bus Lane Junction', score: 70, highlight: false },
      { name: 'Pedestrian Crossing Junction', score: 57, highlight: false },
      { name: 'Junction 3', score: 23, highlight: false }
    ]);
  
    const handleSelect = (selectedJunction) => {
      // Update the highlights in the junctions array
      const updatedJunctions = junctions.map(junction => ({
        ...junction,
        highlight: junction.name === selectedJunction.name
      }));
      
      setJunctions(updatedJunctions);
      setSelectedJunction(selectedJunction);
    };
    
    return (
      <div className={styles.container}>
        <div className = {styles.header}>
          <h1>Named Junction!</h1>
        </div>
        <div className={styles.backButtonContainer}>
        <button className={styles.backButton}>
              <Link to="/MainPage">Back to Junction Configuration Menu</Link>
            </button>
        </div>  
        <div className={styles.side}>
        <VPHDisplayForm 
          />

        </div>
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>Junction Rankings</h1>
          <p className={styles.subtitle}>Click on a score to see how it was calculated</p>
          
          <JunctionList 
            junctions={junctions}
            onSelect={handleSelect}
          />
          
            <button className = {styles.backButton}>
            <Link to="/Leaderboard">See other Projects</Link>
          </button>
        </div>
        
        <div className={styles.rightPanel}>
          {selectedJunction && (
            <>
              <ScoreBreakdown junctionName={selectedJunction.name} score={selectedJunction.score} />
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default JunctionRankings;