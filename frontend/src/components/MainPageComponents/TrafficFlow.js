import React, { useState, useEffect } from 'react';
import JunctionInput from './JunctionInput';
import './TrafficFlow.css';
import ResetVPHButton from '../ButtonComponents/ResetVPHButton';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';
import BackButton from '../ButtonComponents/BackButton';

// formData is now the JSON file containing information for the junction the user is configuring
function TrafficFlow({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) {
    // Initialize state with passed formData or default values
    const [trafficData, setTrafficData] = useState(() => {
        // Check if formData has the expected JSON structure
        if (formData.vphNorth && formData.vphSouth && formData.vphEast && formData.vphWest) {
            // Transform JSON format into the component's internal format
            return {
                north: {
                    enter: formData.vphNorth?.enter || 0, 
                    south: formData.vphNorth?.exitSouth || 0,
                    east: formData.vphNorth?.exitEast || 0,
                    west: formData.vphNorth?.exitWest || 0
                },
                south: {
                    enter: formData.vphSouth?.enter || 0,
                    north: formData.vphSouth?.exitNorth || 0,
                    east: formData.vphSouth?.exitEast || 0,
                    west: formData.vphSouth?.exitWest || 0
                },
                east: {
                    enter: formData.vphEast?.enter || 0,
                    north: formData.vphEast?.exitNorth || 0,
                    south: formData.vphEast?.exitSouth || 0,
                    west: formData.vphEast?.exitWest || 0
                },
                west: {
                    enter: formData.vphWest?.enter || 0,
                    north: formData.vphWest?.exitNorth || 0,
                    south: formData.vphWest?.exitSouth || 0,
                    east: formData.vphWest?.exitEast || 0
                }
            };
        }
        // Default empty state if no valid formData
        return {
            north: { enter: 0, south: 0, east: 0, west: 0 },
            south: { enter: 0, north: 0, east: 0, west: 0 },
            east: { enter: 0, north: 0, south: 0, west: 0 },
            west: { enter: 0, north: 0, south: 0, east: 0 }
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

    // Convert traffic data to required JSON format
    const formatTrafficDataToJSON = () => {
        const formatDirectionData = (direction, data) => {
            const exits = {
                north: { key: 'exitNorth', value: parseInt(data.north) || 0 },
                south: { key: 'exitSouth', value: parseInt(data.south) || 0 },
                east: { key: 'exitEast', value: parseInt(data.east) || 0 },
                west: { key: 'exitWest', value: parseInt(data.west) || 0 }
            };

            const entry = {
                enter: parseInt(data.enter) || 0
            };

            // Add all exits except for the entry direction
            Object.entries(exits).forEach(([exitDir, exitData]) => {
                if (exitDir !== direction) {
                    entry[exitData.key] = exitData.value;
                }
            });

            return entry;
        };

        return {
            vphNorth: formatDirectionData('north', trafficData.north),
            vphSouth: formatDirectionData('south', trafficData.south),
            vphEast: formatDirectionData('east', trafficData.east),
            vphWest: formatDirectionData('west', trafficData.west)
        };
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
            north: { enter: 0, south: 0, east: 0, west: 0 },
            south: { enter: 0, north: 0, east: 0, west: 0 },
            east: { enter: 0, north: 0, south: 0, west: 0 },
            west: { enter: 0, north: 0, south: 0, east: 0 }
        });
    };

    // Save and proceed to next form
    const handleSaveNext = () => {
        if (isValid) {
            const formattedData = formatTrafficDataToJSON();
            saveFormData('trafficFlow', formattedData);
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