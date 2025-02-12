import React from 'react';
import styles from './JunctionRankings.module.css';

const JunctionList = ({ junctions, onSelect }) => {
    const handleSelect =()=>{
        
    }
    return(
    <div className={styles.junctionList}>
        {junctions.map(junction => (
        <div 
            key={junction.name}
            className={`${styles.junctionRow} ${junction.highlight ? styles.highlighted : ''}`}
            onClick={() => onSelect(junction)}
        >
            <span className={styles.junctionName}>{junction.name}</span>
            <span className={styles.score}>{junction.score}</span>
        </div>
        ))}
    </div>
)
};

export default JunctionList;