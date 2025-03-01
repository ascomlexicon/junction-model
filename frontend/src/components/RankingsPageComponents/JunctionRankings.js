import React, { useState, useEffect } from 'react';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import { Link } from "react-router-dom";
import VPHDisplayForm from './VPHDisplayForm';
import axios from 'axios';

const JunctionRankings = ({ firstConfiguredJunction }) => {
  // Used whilst the data is being served from the backend
  // When this is true, display a loading screen so the user is still engaged
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState(null);

  // Keep track of both selected junction and junctions state
  const [selectedJunction, setSelectedJunction] = useState(null);

  const [junctions, setJunctions] = useState([]);

  // This code runs once when the component mounts
  // TODO: Lookup how to do multiple GET requests at once (should be a tab in a tab group on Kians mac)
  useEffect(() => {
    // FIXME: GET Request for the name of all junctions with the same vph data as firstConfiguredJunction
      // Ie get all junctions from the same project as firstConfiguredJunction
    // axios.get('your_api_endpoint/junctions')
    //   .then(function (response) {
    //     // handle success
    // TODO: Add all junctions to a list with their name and the attribute of highlight : false first
      // Eg = [{name : "Junction 1", highlight: false}, {name : "Junction 2", highlight: false}]
    //     setJunctions(response.data);
    //     setLoading(false);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //     setError(error);
    //     setLoading(false);
    //   });

    // FIXME: GET Request for data of firstConfiguredJunction
    // axios.get('___')
    //   .then(function (response) {
    //     // handle success
    // TODO: Change the value of highlights to true for the relevant junction
    //     setSelectedJunction(response.data)
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
  }, []);

  const handleSelect = (selectedJunction) => {
    // Update the highlights in the junctions array
    const updatedJunctions = junctions.map(junction => ({
      ...junction,
      highlight: junction.name === selectedJunction.name
    }));

    setJunctions(updatedJunctions);

    // FIXME: GET Request for selectedJunction
    // axios.get('___')
    //   .then(function (response) {
    //     // handle success
    // TODO: Change the value of highlights to true for the relevant junction
    //     setSelectedJunction(response.data)
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
  };
  
  return (
    <div className={styles.container}>
      <div className = {styles.header}>
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
          <button className={styles.backButton} >
            <Link to="/MainPage" style={{ 
              display: 'block', 
              width: '100%', 
              height: '100%' 
            }}>Back to Junction Configuration Menu</Link>
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
            <Link to="/Leaderboard" style={{ 
              display: 'block', 
              width: '100%', 
              height: '100%' 
            }}>See other Projects</Link>
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