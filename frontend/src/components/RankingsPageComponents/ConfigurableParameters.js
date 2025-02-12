import React from 'react';
import styles from './JunctionRankings.module.css';

const ConfigurableParameters = () => {
    return(
        <div className={styles.parameters}>
        <h3>Configurable Parameters Inputted</h3>
        <table className={styles.trafficFlow}>
            <thead>
            <tr>
                <th>Traffic Flow</th>
                <th>North</th>
                <th>East</th>
                <th>South</th>
                <th>West</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Northbound</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Southbound</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Eastbound</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Westbound</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        </div>
    )
  };

  export default ConfigurableParameters;