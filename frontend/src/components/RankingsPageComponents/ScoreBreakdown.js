import React from 'react';
import styles from './JunctionRankings.module.css';

const ScoreBreakdown = ({ junctionName, score }) => {
    return(
        <div className={styles.scoreBreakdown}>
        <h2>Score Breakdown for: {junctionName}</h2>
        <div className={styles.overallScore}>Overall Score: {score}</div>
        
        <table className={styles.criteriaTable}>
            <thead>
            <tr>
                <th>Criteria</th>
                <th>North</th>
                <th>East</th>
                <th>South</th>
                <th>West</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Average Wait</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Maximum Wait</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Maximum Queue</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        
        <div className={styles.weightings}>
            <h3>Weightings</h3>
            <p>Average Wait:</p>
            <p>Maximum Wait:</p>
            <p>Maximum Queue</p>
        </div>
        
        <div className={styles.formula}>
            <h3>Formula Used</h3>
            <div className={styles.formulaBox}></div>
        </div>
        </div>
    )
};

export default ScoreBreakdown;