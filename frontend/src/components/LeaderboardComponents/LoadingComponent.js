import React from 'react';
import styles from '../LeaderboardComponents/ProjectLeaderboard.module.css';

const LoadingComponent = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      <h2 className={styles.loadingTitle}>Loading Projects</h2>
      <p className={styles.loadingText}>Retrieving your junction data...</p>
    </div>
  );
};

export default LoadingComponent;