import React from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';
import { Link } from "react-router-dom";

// A reusable component to display VPH data for a single direction
const DirectionDataSection = ({ title, data }) => {
  return (
    <div className={styles.directionSection}>
      <h3 className={styles.direction}>{title}</h3>
      {Object.entries(data).map(([key, value]) => {
        // Format the key for display (e.g., "exitEast" becomes "Exit east")
        const formattedKey = key === "entering" 
          ? "Entering" 
          : key.replace("exit", "Exit ");
        
        return (
          <div key={key} className={styles.dataField}>
            <label>{formattedKey}:</label>
            <div className={styles.dataValue}>{value}</div>
          </div>
        );
      })}
    </div>
  );
};

// The main VPH data display component
const VPHDataDisplay = ({ projectData }) => {
  if (!projectData) {
    return (
      <div className={styles.noSelection}>
        <p>Please select a project from the list to view its VPH data.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.projectName}>{projectData.name} VPH Data</h2>
      
      <div className={styles.vphDataGrid}>
        <DirectionDataSection title="North" data={projectData.vphData.north} />
        <DirectionDataSection title="South" data={projectData.vphData.south} />
        <DirectionDataSection title="East" data={projectData.vphData.east} />
        <DirectionDataSection title="West" data={projectData.vphData.west} />
      </div>
      
      <button className={styles.configuredNote}>
        <Link to = '/RankingsPage' className={styles.configuredBtn}>See configured junctions for {projectData.name}</Link>
      </button>
    </div>
  );
};

export default VPHDataDisplay;