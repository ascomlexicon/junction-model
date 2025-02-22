import React, { useState, useEffect } from 'react';
import JunctionInput from './JunctionInput';
import './TrafficFlow.css';
import ResetVPHButton from '../ButtonComponents/ResetVPHButton';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';
import BackButton from '../ButtonComponents/BackButton';

function TrafficFlow({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) {
    // Initialize state with passed formData or default values
    const [trafficData, setTrafficData] = useState(() => {
        return Object.keys(formData).length > 0 ? formData : {
            north: { south: 0, east: 0, west: 0 },
            south: { north: 0, east: 0, west: 0 },
            east: { north: 0, south: 0, west: 0 },
            west: { north: 0, south: 0, east: 0 }
        };
    });

    // Validation state
    const [isValid, setIsValid] = useState(false);

    // Validate the inputs whenever trafficData changes
    useEffect(() => {
        validateForm();
    }, [trafficData]);

    // Validate that at least one direction has traffic flow
    const validateForm = () => {
        let hasTraffic = false;
        
        // Check if any direction has values greater than 0
        Object.values(trafficData).forEach(direction => {
            Object.values(direction).forEach(value => {
                if (value > 0) {
                    hasTraffic = true;
                }
            });
        });
        
        setIsValid(hasTraffic);
    };

    // Handle input updates from JunctionInput components
    const handleInputUpdate = (incomingDirection, data) => {
        setTrafficData(prevData => ({
            ...prevData,
            [incomingDirection.toLowerCase()]: data
        }));
    };

    // Reset VPH data for all forms
    const handleResetVPH = () => {
        resetForm('trafficFlow');
        setTrafficData({
            north: { south: 0, east: 0, west: 0 },
            south: { north: 0, east: 0, west: 0 },
            east: { north: 0, south: 0, west: 0 },
            west: { north: 0, south: 0, east: 0 }
        });
    };

    // Save and proceed to next form
    const handleSaveNext = () => {
        if (isValid) {
            saveFormData('trafficFlow', trafficData);
            setActiveStep(1); // Move to Lane Customisation
        }
    };

    // Handle back button (going back to instructions)
    const handleBack = () => {
        setActiveStep(-1); // Go back to InstructionsPage
    };

    return(
        <div className="junction-forms-container">
            <div className="instructions">
                <h2>Instructions</h2>
                <ul>
                    <li>Enter vehicle flow rates between junctions</li>
                    <li>Values must be greater than 0</li>
                    <li>At least one direction must have traffic</li>
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
                <BackButton onClick={handleBack} label="Back to Instructions" />
                <ResetVPHButton onClick={handleResetVPH} />
                <ResetAllButton onClick={resetAllForms} />
                <SaveNextButton onClick={handleSaveNext} disabled={!isValid} />
            </div>
        </div>
    );
}

export default TrafficFlow;