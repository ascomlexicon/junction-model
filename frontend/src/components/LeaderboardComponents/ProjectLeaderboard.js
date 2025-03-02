import React, { useState, useEffect } from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';
import { Link } from "react-router-dom";
import VPHDataDisplay from './VPHDisplayData'; // Import the VPH data component

const ProjectLeaderboard = () => {
  // Used whilst the data is being served from the backend
  // When this is true, display a loading screen so the user is still engaged
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // All of the projects stored in the backend
  const [projects, setProjects] = useState([]);

  // Project clicked on by the user, initially set to null
  const [selectedProject, setSelectedProject] = useState(null);

  // FIXME: GET Request for all projects stored in the backend
  // useEffect(() => {
    // This code runs once when the component mounts
    // axios.get('your_api_endpoint/projects')
    //   .then(function (response) {
    //     // handle success
      // TODO: Target is to iterate through each object in the returned GET request, need to check the format of the response
      // const allProjects = [];
      // Response.data.array.forEach(element => {
      //   // Convert each response to the below format
      //   const project = {
      //     name: element.name,
      //     // TODO: Ask Josh about the need/use of ID
      //     id: element.name,
      //     vphData: {
      //       north: { entering: element.north.entering, exitEast: element.north.exitEast, exitSouth: element.north.exitSouth, exitWest: element.north.exitWest },
      //       south: { entering: element.south.entering, exitNorth: element.south.exitNorth, exitEast: element.south.exitEast, exitWest: element.south.exitWest },
      //       east: { entering: element.east.entering, exitNorth: element.east.exitNorth, exitSouth: element.east.exitSouth, exitWest: element.east.exitWest },
      //       west: { entering: element.west.entering, exitNorth: element.west.exitNorth, exitEast: element.west.exitEast, exitSouth: element.west.exitSouth }
      //     }
      //   };
      //   allProjects.push(project);
      // });
      // setProjects(allProjects);
      // setLoading(false);

      // TODO: This should be the structure of allProjects from above:
      // const allProjects = [{ 
      //   name: 'Coventry A', 
      //   id: 'coventry-a',
      //   vphData: {
      //     north: { entering: "1250", exitEast: "320", exitSouth: "530", exitWest: "400" },
      //     south: { entering: "1180", exitNorth: "510", exitEast: "290", exitWest: "380" },
      //     east: { entering: "980", exitNorth: "310", exitSouth: "290", exitWest: "380" },
      //     west: { entering: "1050", exitNorth: "420", exitEast: "310", exitSouth: "320" }
      //   }
      // },
      // { 
      //   name: 'Warwick', 
      //   id: 'warwick',
      //   vphData: {
      //     north: { entering: "890", exitEast: "280", exitSouth: "410", exitWest: "200" },
      //     south: { entering: "920", exitNorth: "380", exitEast: "260", exitWest: "280" },
      //     east: { entering: "750", exitNorth: "250", exitSouth: "210", exitWest: "290" },
      //     west: { entering: "820", exitNorth: "310", exitEast: "230", exitSouth: "280" }
      //   }
      // }];
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //     setError(error);
    //     setLoading(false);
    //   });
  // }, []);

  const handleSelectProject = (project) => {
    // FIXME: Make get request for the project passed clicked on
    // axios.get('___')
    //   .then(function (response) {
    //     setSelectedProject(response.data);
    //   }) 
    //   .catch(function (error) {
    //     // Handle error
    //   });
  };
  
  return (
    <div className={styles.pageContainer}>
      {/* Page Header with Title and Back Button */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Current Projects</h1>
        <Link to="/MainPage" className={styles.backButton}>
          Back to Junction Configuration Menu
        </Link>
      </div>
      
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Please select a project to view VPH data</p>
          
          <div className={styles.junctionList}>
            {projects.map((project) => (
              <div 
                key={project.id}
                className={`${styles.junctionRow} ${selectedProject && selectedProject.id === project.id ? styles.highlighted : ''}`}
                onClick={() => handleSelectProject(project)}
              >
                <span>{project.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.rightPanel}>
          {/* Use the reusable VPH data component */}
          <VPHDataDisplay projectData={selectedProject} />
        </div>
      </div>
    </div>
  );
};

export default ProjectLeaderboard;