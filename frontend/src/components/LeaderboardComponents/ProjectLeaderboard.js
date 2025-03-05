import React, { useState } from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';
import { Link } from "react-router-dom";
import VPHDataDisplay from './VPHDisplayData'; // Import the VPH data component

const ProjectLeaderboard = () => {
  // Sample project data with VPH information
  const [projects, setProjects] = useState([
    { 
      name: 'Coventry A', 
      id: 'coventry-a',
      vphData: {
        north: { entering: "1250", exitEast: "320", exitSouth: "530", exitWest: "400" },
        south: { entering: "1180", exitNorth: "510", exitEast: "290", exitWest: "380" },
        east: { entering: "980", exitNorth: "310", exitSouth: "290", exitWest: "380" },
        west: { entering: "1050", exitNorth: "420", exitEast: "310", exitSouth: "320" }
      }
    },
    { 
      name: 'Warwick', 
      id: 'warwick',
      vphData: {
        north: { entering: "890", exitEast: "280", exitSouth: "410", exitWest: "200" },
        south: { entering: "920", exitNorth: "380", exitEast: "260", exitWest: "280" },
        east: { entering: "750", exitNorth: "250", exitSouth: "210", exitWest: "290" },
        west: { entering: "820", exitNorth: "310", exitEast: "230", exitSouth: "280" }
      }
    },
    { 
      name: 'Leamington North', 
      id: 'leamington-north',
      vphData: {
        north: { entering: "780", exitEast: "230", exitSouth: "350", exitWest: "200" },
        south: { entering: "820", exitNorth: "310", exitEast: "240", exitWest: "270" },
        east: { entering: "690", exitNorth: "210", exitSouth: "230", exitWest: "250" },
        west: { entering: "750", exitNorth: "280", exitEast: "190", exitSouth: "280" }
      }
    },
    { 
      name: 'Leamington South', 
      id: 'leamington-south',
      vphData: {
        north: { entering: "830", exitEast: "250", exitSouth: "380", exitWest: "200" },
        south: { entering: "860", exitNorth: "320", exitEast: "260", exitWest: "280" },
        east: { entering: "720", exitNorth: "240", exitSouth: "210", exitWest: "270" },
        west: { entering: "790", exitNorth: "300", exitEast: "220", exitSouth: "270" }
      }
    },
    { 
      name: 'Kings Cross', 
      id: 'kings-cross',
      vphData: {
        north: { entering: "1520", exitEast: "490", exitSouth: "620", exitWest: "410" },
        south: { entering: "1430", exitNorth: "580", exitEast: "410", exitWest: "440" },
        east: { entering: "1290", exitNorth: "430", exitSouth: "380", exitWest: "480" },
        west: { entering: "1350", exitNorth: "520", exitEast: "390", exitSouth: "440" }
      }
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);

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
          <VPHDataDisplay projectData={selectedProject} />
        </div>
      </div>
    </div>
  );
};

export default ProjectLeaderboard;