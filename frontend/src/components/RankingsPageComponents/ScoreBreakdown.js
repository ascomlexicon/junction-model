import React from 'react';
import styles from './JunctionRankings.module.css';
import DisplayLaneCustomisation from './DisplayLaneCustomisation';
import DisplayPedestrianCrossing from './DisplayPedestrianCrossing';
import DisplayDirectionPrioritisation from './DisplayDirectionPrioritisation';

const ScoreBreakdown = ({ junctionData }) => {
    console.log(junctionData);
    return(
        <div className={styles.scoreBreakdown}>
          <h2 className={styles.scoreBreakdownTitle}>Score Breakdown for: {junctionData.name}</h2>
          <div className={styles.overallScore}>Overall Score: {junctionData.score}</div>
          
          {/* TODO: At the very least at the metrics for the whole junction, decide whether or not to include for each quarter (probably leave out) */}
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
                  <td>{junctionData.northMetrics.avgWaitTime}</td>
                  <td>{junctionData.eastMetrics.avgWaitTime}</td>
                  <td>{junctionData.southMetrics.avgWaitTime}</td>
                  <td>{junctionData.westMetrics.avgWaitTime}</td>
              </tr>
              <tr>
                  <td>Maximum Wait</td>
                  <td>{junctionData.northMetrics.maxWaitTime}</td>
                  <td>{junctionData.eastMetrics.maxWaitTime}</td>
                  <td>{junctionData.southMetrics.maxWaitTime}</td>
                  <td>{junctionData.westMetrics.maxWaitTime}</td>
              </tr>
              <tr>
                  <td>Maximum Queue</td>
                  <td>{junctionData.northMetrics.maxQueueLength}</td>
                  <td>{junctionData.eastMetrics.maxQueueLength}</td>
                  <td>{junctionData.southMetrics.maxQueueLength}</td>
                  <td>{junctionData.westMetrics.maxQueueLength}</td>
              </tr>
              </tbody>
          </table>

          <div className={styles.junctionImageContainer}>
              <h3>Junction Image</h3>
              {junctionData.junctionImage && (
                  <img 
                      src={junctionData.junctionImage} 
                      alt={`Image of ${junctionData.name} junction`} 
                      className={styles.junctionImage}
                  />
              )}
          </div>

          <div className={styles.configurableParameters}>
              <h2 className={styles.configHeading}>Configurable Parameters</h2>
              <DisplayLaneCustomisation entering={junctionData.lanesEntering} exiting={junctionData.lanesExiting} leftTurn={junctionData.leftTurnLanes} busOrCycle={junctionData.isBusOrCycle === 'bus' || junctionData.isBusOrCycle === 'cycle'}/>
              <DisplayPedestrianCrossing addCrossings={junctionData.isCrossings} crossingDuration={junctionData.crossingDuration} requestsPerHour={junctionData.crossingRequestsPerHour} />
              <DisplayDirectionPrioritisation enablePrioritisation={junctionData.enablePrioritisation} directions={junctionData.directionPrioritisation}/>
          </div>

        </div>
    )
};

export default ScoreBreakdown;