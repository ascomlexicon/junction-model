import React from 'react';
import styles from './JunctionRankings.module.css';
import DisplayLaneCustomisation from './DisplayLaneCustomisation';
import DisplayPedestrianCrossing from './DisplayPedestrianCrossing';
import DisplayDirectionPrioritisation from './DisplayDirectionPrioritisation';

const ScoreBreakdown = ({ junctionData }) => {
    return(
        <div className={styles.scoreBreakdown}>
          <h2 className={styles.scoreBreakdownTitle}>Score Breakdown for: {junctionData.name}</h2>
          <div className={styles.overallScore}>Overall Score: {junctionData.score.toFixed(4)}</div>
          
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
                  <td>Average Wait <i>(mins:secs)</i></td>
                  <td>{Math.floor((junctionData.northMetrics.avgWaitTime * 240 / 60000))}:{Math.floor((junctionData.northMetrics.avgWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
                  <td>{Math.floor((junctionData.eastMetrics.avgWaitTime * 240 / 60000))}:{Math.floor((junctionData.eastMetrics.avgWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
                  <td>{Math.floor((junctionData.southMetrics.avgWaitTime * 240 / 60000))}:{Math.floor((junctionData.southMetrics.avgWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
                  <td>{Math.floor((junctionData.westMetrics.avgWaitTime * 240 / 60000))}:{Math.floor((junctionData.westMetrics.avgWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
              </tr>
              <tr>
                  <td>Maximum Wait <i>(mins:secs)</i></td>
                  <td>{Math.floor((junctionData.northMetrics.maxWaitTime * 240 / 60000))}:{Math.floor((junctionData.northMetrics.maxWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
                  <td>{Math.floor((junctionData.eastMetrics.maxWaitTime * 240 / 60000))}:{Math.floor((junctionData.eastMetrics.maxWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
                  <td>{Math.floor((junctionData.southMetrics.maxWaitTime * 240 / 60000))}:{Math.floor((junctionData.southMetrics.maxWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
                  <td>{Math.floor((junctionData.westMetrics.maxWaitTime * 240 / 60000))}:{Math.floor((junctionData.westMetrics.maxWaitTime * 240 / 1000) % 60).toString().padStart(2, '0')}</td>
              </tr>
              <tr>
                  <td>Maximum Queue <i>(# cars)</i></td>
                  <td>{Math.round(junctionData.northMetrics.maxQueueLength)}</td>
                  <td>{Math.round(junctionData.eastMetrics.maxQueueLength)}</td>
                  <td>{Math.round(junctionData.southMetrics.maxQueueLength)}</td>
                  <td>{Math.round(junctionData.westMetrics.maxQueueLength)}</td>
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
              <DisplayLaneCustomisation entering={junctionData.lanesEntering} exiting={junctionData.lanesExiting} leftTurn={junctionData.leftTurnLanes} busOrCycle={junctionData.isBusCycle} specialLanes={junctionData.specialLanes}/>
              <DisplayPedestrianCrossing addCrossings={junctionData.isCrossings} crossingDuration={junctionData.crossingDuration} requestsPerHour={junctionData.crossingRequestsPerHour} />
              <DisplayDirectionPrioritisation enablePrioritisation={junctionData.enablePrioritisation} directions={junctionData.directionPrioritisation}/>
          </div>

        </div>
    )
};

export default ScoreBreakdown;