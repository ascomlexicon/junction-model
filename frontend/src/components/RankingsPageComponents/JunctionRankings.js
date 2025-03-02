import React, { useState, useEffect } from 'react';
import styles from './JunctionRankings.module.css';
import JunctionList from './JunctionList';
import ScoreBreakdown from './ScoreBreakdown';
import { Link } from "react-router-dom";
import VPHDisplayForm from './VPHDisplayForm';
import axios from 'axios';

// Structure of clickedJunction
// TODO: Think we should add a name attribute to the junction
// clickedJunction = {
//   "name": "Junction 1",
//   "score": 0,
//   "leftTurnLanes": {},
//   "lanesEntering": {},
//   "lanesExiting": {},
//   "isBusOrCycle": "",
//   "busCycleLaneDuration": [
//     {
//       "vphSpecialNorth": [
//         {
//           "enter": 200,
//           "exitSouth": 100,
//           "exitEast": 50,
//           "exitWest": 50
//         }
//       ],
//       "vphSpecialSouth": [
//         {
//           "enter": 200,
//           "exitNorth": 100,
//           "exitEast": 50,
//           "exitWest": 50
//         }
//       ],
//       // Left empty if there is no bus lane coming from that direction
//       "vphSpecialEast": [],
//       "vphSpecialWest": [],
//     }
//   ],
//   "lanePrioritisation": ["east", "south", "north", "west"],
//   "isCrossings": true,
//   "crossingDuration": 0,
//   "crossingRequestsPerHour": 0,
//   "vphNorth": [
//     {
//       "enter": 200,
//       "exitSouth": 100,
//       "exitEast": 50,
//       "exitWest": 50
//     }
//   ],
//   "vphSouth": [
//     {
//       "enter": 200,
//       "exitNorth": 100,
//       "exitEast": 50,
//       "exitWest": 50
//     }
//   ],
//   "vphEast": [
//     {
//       "enter": 200,
//       "exitSouth": 100,
//       "exitNorth": 50,
//       "exitWest": 50
//     }
//   ],
//   "vphWest": [
//     {
//       "enter": 200,
//       "exitSouth": 100,
//       "exitEast": 50,
//       "exitNorth": 50
//     }
//   ],
//   junctionImage: null
// }

const JunctionRankings = ({ clickedJunction }) => {
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

  // TODO: Lookup how to do multiple GET requests at once (should be a tab in a tab group on Kians mac)

  // This code runs once when the component mounts
  // useEffect(() => {
  //   // FIXME: GET Request for the name of all junctions with the same vph data as clickedJunction
  //     // Ie get all junctions from the same project as clickedJunction
  //   axios.get('your_api_endpoint/junctions')
  //     .then(function (response) {
  //       // handle success
  //   // TODO: Add all junctions to a list with their name alongside the rest of the data 
  //   // (much easier to make one request that gets ALL of the data rather than multiple 
  //   // requests every time a junction is clicked)
  //       const allJunctions = [];

  //       Response.data.array.forEach(element => {
  //         // Assume for now the structure at the top of the page, ie junctions have a name that is generated in the backend
  //         const junction = {
  //           ...element,
  //         };
          // if (junction.name === clickedJunction.name) {
          //   if we have found the data for the junction we initially clicked on, set this as the selected junction
          //   setSelectedJunction(junction);
          // };
  //         allJunctions.push(junction);
  //       });
  //       setJunctions(allJunctions);
  //       setIsLoading(false);
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //       setError(error);
  //       setIsLoading(false);
  //     });

    // FIXME: GET Request for the project that clickedJunction is from
    // axios.get('___')
    //   .then(function (response) {
    //     // handle success (assume response.data gives us the JSON object of the project, might change to be the name)
    //     setCurrentProject({response.data.name});
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });
  // }, []);

  const handleSelect = (selectedJunction) => {
    setSelectedJunction(selectedJunction);
  };
  
  return (
    <div className={styles.container}>
      <div className = {styles.header}>
        {/* TODO: This needs to be the project that we are working with */}
          <h1>Named Junction!</h1>
        {/* <h1>{currentProject}</h1> */}
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

      {/* Displays a loading screen whilst GET request being served */}
      {isLoading && <p>Fetching data from the backend...</p>}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (
        <>
          <div className={styles.leftPanel}>
            <h1 className={styles.title}>Junction Rankings</h1>
            <p className={styles.subtitle}>Click on a score to see how it was calculated</p>
            
            {/* OLD */}
            <JunctionList 
              junctions={junctions}
              onSelect={handleSelect}
            />

            {/* NEW */}
            {/* Using same approach for highlighting as the ProjectLeaderboard
            => delete JunctionList component */}
            {/* <div className={styles.junctionList}>
                {junctions.map(junction => (
                <div 
                    key={junction.name}
                    className={`${styles.junctionRow} ${junction.name === selectedJunction.name ? styles.highlighted : ''}`}
                    onClick={() => handleSelect(junction)}
                >
                    <span className={styles.junctionName}>{junction.name}</span>
                    <span className={styles.score}>{junction.score}</span>
                </div>
                ))}
            </div> */}
            
            <button className = {styles.backButton}>
            <Link to="/Leaderboard" style={{ 
              display: 'block', 
              width: '100%', 
              height: '100%' 
            }}>See other Projects</Link>
            </button>
          </div>
          
          <div className={styles.rightPanel}>
            {/* OLD */}
            {selectedJunction && (
              <>
                <ScoreBreakdown junctionName={selectedJunction.name} score={selectedJunction.score} />
              </>
            )}
            {/* NEW */}
            {/* {selectedJunction && (
              <>
                <ScoreBreakdown junction={selectedJunction} />
              </>
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default JunctionRankings;