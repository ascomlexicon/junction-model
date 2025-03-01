import React, { useState } from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';
import { Link } from "react-router-dom";
import VPHDataDisplay from './VPHDisplayData'; // Import the VPH data component

const ProjectLeaderboard = () => {
  // Used whilst the data is being served from the backend
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // All of the projects stored in the backend
  const [projects, setProjects] = useState([]);

  // Project clicked on by the user, initially set to null
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // This code runs once when the component mounts
    // axios.get('your_api_endpoint/projects')
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

  const handleSelectProject = (project) => {
    // TODO: Make get request for the project passed through
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