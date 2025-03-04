import React from 'react';
import styles from './JunctionRankings.module.css';
import DisplayLaneCustomisation from './DisplayLaneCustomisation';
import DisplayPedestrianCrossing from './DisplayPedestrianCrossing';
import DisplayDirectionPrioritisation from './DisplayDirectionPrioritisation';


const ScoreBreakdown = ({ junctionName, score }) => {
    return(
        <div className={styles.scoreBreakdown}>
          <h2 className={styles.scoreBreakdownTitle}>Score Breakdown for: {junctionName}</h2>
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
          

          <div className={styles.configurableParameters}>
              <h2 className={styles.configHeading}>Configurable Parameters</h2>
              <DisplayLaneCustomisation />
              <DisplayPedestrianCrossing />
              <DisplayDirectionPrioritisation />
          </div>

        </div>
    )
};

export default ScoreBreakdown;