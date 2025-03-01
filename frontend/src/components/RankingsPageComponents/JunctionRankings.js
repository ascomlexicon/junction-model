import React, { useState, useEffect } from 'react';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import { Link } from "react-router-dom";
import VPHDisplayForm from './VPHDisplayForm';
import axios from 'axios';

// TODO: When retrieving the ranking for the junction for the first time, it needs to be the same junction that the user configured
  // Need to remember this somehow so we make the correct request - FIXME: SEE NOTES ON MACBOOK/ICLOUD
const JunctionRankings = ({ firstConfiguredJunction }) => {
  // Keep track of both selected junction and junctions state
  // const [selectedJunction, setSelectedJunction] = useState(null);

  const [selectedJunction, setSelectedJunction] = useState((firstConfiguredJunction) => {
    // TODO: Make get request for the default junction passed
      // Use the information in firstConfiguredJunction to get the junction info the user has just configured
    // axios.get('___')
    //   .then(function (response) {
    //     // handle success
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
  });

  const [junctions, setJunctions] = useState([
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
  ]);

  useEffect(() => {
    // This code runs once when the component mounts
    // axios.get('your_api_endpoint/junctions')
    //   .then(function (response) {
    //     // handle success
    //     setProjects(response.data);
    //     setLoading(false);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //     setError(error);
    //     setLoading(false);
    //   });
  }, []);

  const handleSelect = (selectedJunction) => {
    // Update the highlights in the junctions array
    const updatedJunctions = junctions.map(junction => ({
      ...junction,
      highlight: junction.name === selectedJunction.name
    }));
    
    // TODO: Add a getrequest here, see above
    // axios.get('___')
    //   .then(function (response) {
    //     setSelectedProject(response.data);
    //   }) 
    //   .catch(function (error) {
    //     // Handle error
    //   });
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