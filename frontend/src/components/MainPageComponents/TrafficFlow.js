import React, { useState } from 'react';
import JunctionInput from './JunctionInput';
import './TrafficFlow.css';
import ResetVPHButton from '../ButtonComponents/ResetVPHButton';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';
import BackButton from '../ButtonComponents/BackButton';

function TrafficFlow({ isFirstForm = true, onSaveNext, onBack, onResetAll }) {
    const [trafficData, setTrafficData] = useState({
        north: { south: 0, east: 0, west: 0 },
        south: { north: 0, east: 0, west: 0 },
        east: { north: 0, south: 0, west: 0 },
        west: { north: 0, south: 0, east: 0 }
    });

    // Handle input updates from JunctionInput components
    const handleInputUpdate = (incomingDirection, data) => {
        setTrafficData(prevData => ({
            ...prevData,
            [incomingDirection.toLowerCase()]: data
        }));
    };

    // Reset VPH data for all forms
    const handleResetVPH = () => {
        setTrafficData({
            north: { south: 0, east: 0, west: 0 },
            south: { north: 0, east: 0, west: 0 },
            east: { north: 0, south: 0, west: 0 },
            west: { north: 0, south: 0, east: 0 }
        });
    };

    // Save and proceed to next form
    const handleSaveNext = () => {
        if (onSaveNext) {
            onSaveNext('trafficFlow', trafficData);
        }
    };

    return(
        <div className="junction-forms-container">
            <h1 className="junction-title">Junction Traffic Flow Model</h1>
            <div className="instructions">
                <h2>Instructions</h2>
                <ul>
                    <li>Restrictions on this page</li>
                    <li>Values must be greater than 0</li>
                </ul>
            </div>
            <div className="forms-grid">
                {/* First row */}
                <div className="form-cell">
                    <h1>North</h1>
                    <JunctionInput
                        incomingDirection="North"
                        outgoingDirection1="South"
                        outgoingDirection2="East"
                        outgoingDirection3="West"
                        onUpdate={(data) => handleInputUpdate('north', data)}
                        values={trafficData.north}
                    />
                </div>
                <div className="form-cell">
                    <h1>South</h1>
                    <JunctionInput
                        incomingDirection="South"
                        outgoingDirection1="North"
                        outgoingDirection2="East"
                        outgoingDirection3="West"
                        onUpdate={(data) => handleInputUpdate('south', data)}
                        values={trafficData.south}
                    />
                </div>
                
                {/* Second row */}
                <div className="form-cell">
                    <h1>East</h1>
                    <JunctionInput
                        incomingDirection="East"
                        outgoingDirection1="North"
                        outgoingDirection2="South"
                        outgoingDirection3="West"
                        onUpdate={(data) => handleInputUpdate('east', data)}
                        values={trafficData.east}
                    />
                </div>
                <div className="form-cell">
                    <h1>West</h1>
                    <JunctionInput
                        incomingDirection="West"
                        outgoingDirection1="North"
                        outgoingDirection2="South"
                        outgoingDirection3="East"
                        onUpdate={(data) => handleInputUpdate('west', data)}
                        values={trafficData.west}
                    />
                </div>
            </div>

            {/* Button Container */}
            <div className="button-container">
                {!isFirstForm && (
                    <BackButton onBack={onBack} />
                )}
                <ResetVPHButton onReset={handleResetVPH} />
                <ResetAllButton onResetAll={onResetAll} />
                <SaveNextButton onSave={handleSaveNext} />
            </div>
        </div>
    );
}

export default TrafficFlow;