import React, { useState, useEffect } from 'react';
import { Slab } from 'react-loading-indicators';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import { Link } from "react-router-dom";
import VPHDisplayForm from './VPHDisplayForm';
import axios from 'axios';

// TODO: Need to think about the case when we render this component from the projects page
  // See VPHDisplayData

// TODO: Need to have an img tag with the junctionCanvas
const JunctionRankings = ({ clickedJunction = {} }) => {
  // Used whilst the data is being retrieved from the backend
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState(null);

  // Keep track of both selected junction and junctions state
  const [selectedJunction, setSelectedJunction] = useState(null);
  
  // Junctions contains a list of junctions, each of which are an object, for the vph
  // data which is the same as clickedJunction (ie from the same project)
  const [junctions, setJunctions] = useState([]);
  
  // Current project that all of the junctions displayed are from
  const [currentProject, setCurrentProject] = useState(null);

  // Using ref to track if effect has already run (prevents simulations running indefinitely)
  const hasRun = React.useRef(false);

  // This code runs once when the component mounts
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    
    const vphData = {
      vphNorth: clickedJunction.vphNorth,
      vphSouth: clickedJunction.vphSouth,
      vphEast: clickedJunction.vphEast,
      vphWest: clickedJunction.vphWest
    };

    axios
      .post("http://localhost:8080/api/model", clickedJunction)
      .then((response) => {
        console.log(response.data);
        console.log("SIMULATION COMPLETE");

        // Now trigger the GET request after the POST completes
        return axios.post("http://localhost:8080/api/junctions", vphData);
      }) 
      .then((response) => {
        // handle success
        const allJunctions = [];

        console.log(response.data);

        // Response.data is an array of junction JSON objects
        response.data.forEach((element) => {
          const junction = { ...element };

          // FIXME: Very scuffed, not robust
          // if (junction.leftTurnLanes === clickedJunction.leftTurnLanes && junction.lanesEntering === clickedJunction.lanesEntering) {
          //   setSelectedJunction(junction);
          // }
          allJunctions.push(junction);
        });

        setJunctions(allJunctions);

        return axios.post("http://localhost:8080/api/name", vphData);
      })
      .then((response) => {
        // GET Request 2: Get the project that clickedJunction is from
        setCurrentProject(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }

        setError(error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false at the end of both requests
      });
  }, []);

  const handleSelect = (selectedJunction) => {
    setSelectedJunction(selectedJunction);
  };
  
  // Loading screen whilst GET request is being processed
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Slab color="#00a6fb" size="medium" text="Calculating Score..." textColor="" />
        <Link to="/MainPage" className={styles.loadingBackButton}>
        {/* TODO: CHANGE STYLE OF THIS BUTTON */}
          Back to Junction Configuration Menu
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className = {styles.header}>
        <h1>{currentProject}</h1>
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
        <VPHDisplayForm />
      </div>

      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
        <>
          <div className={styles.leftPanel}>
            <h1 className={styles.title}>Junction Rankings</h1>
            <p className={styles.subtitle}>Click on a score to see how it was calculated</p>
            <div className={styles.junctionList}>
                {junctions.map(junction => (
                <div 
                    key={junction.name}
                    // TODO: This needs to be fixed
                    // className={`${styles.junctionRow} ${junction.name === selectedJunction.name ? styles.highlighted : ''}`}
                    className={`${styles.junctionRow}`}
                    onClick={() => handleSelect(junction)}
                >
                    <span className={styles.junctionName}>{junction.name}</span>
                    <span className={styles.score}>{junction.score}</span>
                </div>
                ))}
            </div>
            
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
                <ScoreBreakdown junctionData={selectedJunction} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JunctionRankings;