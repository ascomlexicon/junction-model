import React, { useState, useEffect } from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';
import { Link } from "react-router-dom";
import VPHDataDisplay from './VPHDisplayData'; // Import the VPH data component
import LoadingComponent from './LoadingComponent';

const ProjectLeaderboard = () => {
  // Used whilst the data is being served from the backend
  // When this is true, display a loading screen so the user is still engaged
  const [isLoading, setIsLoading] = useState(true);

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
      //       north: { entering: element.vphNorth.enter, exitEast: element.vphNorth.exitEast, exitSouth: element.vphNorth.exitSouth, exitWest: element.vphNorth.exitWest },
      //       south: { entering: element.vphSouth.entering, exitNorth: element.vphSouth.exitNorth, exitEast: element.vphSouth.exitEast, exitWest: element.vphSouth.exitWest },
      //       east: { entering: element.vphEast.entering, exitNorth: element.vphEast.exitNorth, exitSouth: element.vphEast.exitSouth, exitWest: element.vphEast.exitWest },
      //       west: { entering: element.vphWest.entering, exitNorth: element.vphWest.exitNorth, exitEast: element.vphWest.exitEast, exitSouth: element.vphWest.exitSouth }
      //     }
      //   };
      //   allProjects.push(project);
      // });
      // setProjects(allProjects);
      // setIsLoading(false);

      // This should be the structure of allProjects from above:
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
    //     setIsLoading(false);
    //   });
  // }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };
  
  return (
    <div className={styles.pageContainer}>
      {/* Page Header with Title and Back Button */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Current Projects</h1>
        <Link to="/MainPage" className={styles.backButton} >
          Back to Junction Configuration Menu
        </Link>
      </div>
      
      {isLoading && <LoadingComponent />}
      {error && <p>Error: {error.message}</p>}

      {!isLoading && !error && (
        <>
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
        </>
      )};
    </div>
  );
};

export default ProjectLeaderboard;