import React, { useState, useEffect } from 'react';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import { Link } from "react-router-dom";
import VPHDisplayForm from './VPHDisplayForm';
import axios from 'axios';

// TODO: When retrieving the ranking for the junction for the first time, it needs to be the same junction that the user configured
  // Need to remember this somehow so we make the correct request - FIXME: SEE NOTES ON MACBOOK/ICLOUD
const JunctionRankings = () => {
  // Keep track of both selected junction and junctions state
  // const [selectedJunction, setSelectedJunction] = useState(null);

  const [selectedJunction, setSelectedJunction] = useState(() => {
    // TODO: Make get request for the default junction passed 
    // axios.get('___')
    //   .then(function (response) {
    //     // handle success
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
      // TODO: Optionally add a finally clause too
  });

  const [junctions, setJunctions] = useState([
    // { name: 'Junction 2', score: 79, highlight: false },
    // { name: 'Junction 1', score: 75, highlight: false },
    // { name: 'Bus Lane Junction', score: 70, highlight: false },
    // { name: 'Pedestrian Crossing Junction', score: 57, highlight: false },
    // { name: 'Junction 3', score: 23, highlight: false }

    
    // TODO: make a get request which gets all of the junctions in use (ie fetch the project for the junction that was just configured) 
    // axios.get('___')
    //   .then(function (response) {
    //     // handle success
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
    // TODO: Optionally add a finally clause too

  ]);

  const handleSelect = (selectedJunction) => {
    // Update the highlights in the junctions array
    const updatedJunctions = junctions.map(junction => ({
      ...junction,
      highlight: junction.name === selectedJunction.name
    }));
    
    // TODO: Add a getrequest here, see above
    setJunctions(updatedJunctions);
    setSelectedJunction(selectedJunction);
  };
  
  return (
    <div className={styles.container}>
      <div className = {styles.header}>
        {/* TODO: This needs to be the project that we are working with */}
        <h1>Named Junction!</h1>
      </div>
      <div className={styles.backButtonContainer}>
                  {/* TODO: Change this; not advised to have Link tag within button (I think) */}

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
          <Link to="/Leaderboard">See other leaderboards</Link>
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