import React from 'react';
import styles from './JunctionRankings.module.css';
import DisplayLaneCustomisation from './DisplayLaneCustomisation';
import DisplayPedestrianCrossing from './DisplayPedestrianCrossing';
import DisplayLanePrioritisation from './DisplayLanePrioritisation';

const ScoreBreakdown = ({ junctionData }) => {
    // junctionData is a JSON object which contains 
    return(
        <div className={styles.scoreBreakdown}>
        <h2>Score Breakdown for: {junctionData.name}</h2>
        <div className={styles.overallScore}>Overall Score: {junctionData.score}</div>
        
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
        
        {/* TODO: Spelling mistake, but change in stylesheet also */}
        <div className='styles.confiurableParameters'>
            <h3>Configurable Parameters</h3>
            <DisplayLaneCustomisation entering={junctionData.lanesEntering} exiting={junctionData.lanesExiting} leftTurn={junctionData.leftTurnLanes} busOrCycle={junctionData.isBusOrCycle === 'bus' || junctionData.isBusOrCycle === 'cycle'} busCycleDurations={junctionData.busCycleLaneDuration}/>
            <DisplayPedestrianCrossing addCrossings={junctionData.isCrossings} crossingDuration={junctionData.crossingDuration} requestsPerHour={junctionData.crossingRequestsPerHour} />
            <DisplayLanePrioritisation enablePrioritisation={junctionData.lanePrioritisation.length !== 0} directions={junctionData.lanePrioritisation}/>
        </div>

        </div>
    )
};

export default ScoreBreakdown;