import React, { useState, useEffect } from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';
import { Slab } from 'react-loading-indicators';
import { Link } from "react-router-dom";
import VPHDataDisplay from './VPHDisplayData';
import axios from 'axios';

const ProjectLeaderboard = () => {
  // Used whilst the data is being served from the backend
  // When this is true, display a loading screen so the user is still engaged
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  // All of the projects stored in the backend
  const [projects, setProjects] = useState([]);

  // Project clicked on by the user, initially set to null
  const [selectedProject, setSelectedProject] = useState(null);

  // GET Request 3: Get all projects stored in the backend
  useEffect(() => {
    axios.get('http://localhost:8080/api/projects')
      .then((response) => {
        const allProjects = [];

        console.log(response.data);

        response.data.forEach(element => {
          // Convert each response to the below format
          const project = {
            name: element.name,
            id: element.name,
            vphData: {
              north: { enter: element.vphNorth.enter, exitEast: element.vphNorth.exitEast, exitSouth: element.vphNorth.exitSouth, exitWest: element.vphNorth.exitWest },
              south: { enter: element.vphSouth.enter, exitNorth: element.vphSouth.exitNorth, exitEast: element.vphSouth.exitEast, exitWest: element.vphSouth.exitWest },
              east: { enter: element.vphEast.enter, exitNorth: element.vphEast.exitNorth, exitSouth: element.vphEast.exitSouth, exitWest: element.vphEast.exitWest },
              west: { enter: element.vphWest.enter, exitNorth: element.vphWest.exitNorth, exitEast: element.vphWest.exitEast, exitSouth: element.vphWest.exitSouth }
            }
          };
          allProjects.push(project);
        });
        setProjects(allProjects);
        setIsLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };
  
  // Loading screen whilst GET request is being processed
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Slab color="#00a6fb" size="medium" text="Loading Projects..." textColor="" />
        <Link to="/MainPage" className={styles.loadingBackBtn}>
          Back to Junction Configuration Menu
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Page Header with Title and Back Button */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Current Projects</h1>
        <Link to="/MainPage" className={styles.backButton} >
          Back to Junction Configuration Menu
        </Link>
      </div>
      
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