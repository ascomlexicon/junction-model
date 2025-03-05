import React, { useState, useEffect } from 'react';
import JunctionInput from './JunctionInput';
import './TrafficFlow.css';
import ResetVPHButton from '../ButtonComponents/ResetVPHButton';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';
import BackButton from '../ButtonComponents/BackButton';

function TrafficFlow({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) {
    const [trafficData, setTrafficData] = useState(() => {
        if (formData.vphNorth && formData.vphSouth && formData.vphEast && formData.vphWest) {
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
        return {
            north: { enter: 0, south: 0, east: 0, west: 0 },
            south: { enter: 0, north: 0, east: 0, west: 0 },
            east: { enter: 0, north: 0, south: 0, west: 0 },
            west: { enter: 0, north: 0, south: 0, east: 0 }
        };
    });

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        validateForm();
    }, [trafficData]);

    const validateForm = () => {
        let isAllDataValid = true;
        
        // Check each direction
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(direction => {
            const directionData = trafficData[direction];
            
            // Check if entry is greater than 0
            if (directionData.enter <= 0) {
                isAllDataValid = false;
                return;
            }
            
            // Check if at least one exit has a value
            const hasValidExit = 
                directionData.north >= 0 || 
                directionData.south >= 0 || 
                directionData.east >= 0 || 
                directionData.west >= 0;
            
            if (!hasValidExit) {
                isAllDataValid = false;
            }
        });
        
        setIsValid(isAllDataValid);
    };

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

    const handleInputUpdate = (incomingDirection, data) => {
        setTrafficData(prevData => ({
            ...prevData,
            [incomingDirection.toLowerCase()]: data
        }));
    };

    const handleResetVPH = () => {
        resetForm('trafficFlow');
        setTrafficData({
            north: { enter: 0, south: 0, east: 0, west: 0 },
            south: { enter: 0, north: 0, east: 0, west: 0 },
            east: { enter: 0, north: 0, south: 0, west: 0 },
            west: { enter: 0, north: 0, south: 0, east: 0 }
        });
    };

    const handleSaveNext = () => {
        if (isValid) {
            const formattedData = formatTrafficDataToJSON();
            saveFormData('trafficFlow', formattedData);
            setActiveStep(1);
        }
    };

    const handleBack = () => {
        setActiveStep(-1);
    };

    return(
        <div className="junction-forms-container">
            <div className="instructions">
                <h2>Instructions</h2>
                <ul>
                    <li>Enter vehicle flow rates between junctions</li>
                    <li>Values must be greater than 0</li>
                    <li>Each direction must have an entry and at least one exit</li>
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