import React, { useState, useEffect } from 'react';
import './JunctionInput.css'

// The component now accepts props for the direction names

function JunctionInput({ 

    incomingDirection,    // The direction vehicles are coming from
    outgoingDirection1,   // First possible exit direction
    outgoingDirection2,   // Second possible exit direction
    outgoingDirection3    // Third possible exit direction
}) {

    // We now only need state for the numbers, since directions come from props
    const [totalIncoming, setTotalIncoming] = useState('');
    const [outgoingFlows, setOutgoingFlows] = useState({
        direction1: '',
        direction2: '',
        direction3: ''
    });
    const [isValid, setIsValid] = useState(false);

    // This effect validates that outgoing flows sum to total incoming
    useEffect(() => {
        const sum = Object.values(outgoingFlows)
            .reduce((acc, val) => acc + (parseInt(val) || 0), 0);
        setIsValid(sum === parseInt(totalIncoming));
    }, [outgoingFlows, totalIncoming]);

    // Handle changes to outgoing flow inputs with number validation
    const handleOutgoingChange = (direction, value) => {
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
            setOutgoingFlows(prev => ({
                ...prev,
                [direction]: value
            }));
        }
    };

    // Handle total incoming vehicles change with number validation
    const handleTotalChange = (value) => {
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
            setTotalIncoming(value);
        }
    };

    return (
        <form className="junction-form">
            <div className="incoming-section">
                <h3 className="direction-heading">
                    Traffic {incomingDirection}
                </h3>
                <input
                    type="text"
                    value={totalIncoming}
                    onChange={(e) => handleTotalChange(e.target.value)}
                    placeholder={`Total vehicles ${incomingDirection}`}
                    className="input-field"
                />
            </div>

            <div className="outgoing-section">
                {[
                    { key: 'direction1', name: outgoingDirection1 },
                    { key: 'direction2', name: outgoingDirection2 },
                    { key: 'direction3', name: outgoingDirection3 }
                ].map(({ key, name }) => (
                    <div key={key} className="direction-input">
                        <label className="direction-label">
                            <span className="label-text">Exiting {name}:</span>
                        </label>
                        <input
                            type="text"
                            value={outgoingFlows[key]}
                            onChange={(e) => handleOutgoingChange(key, e.target.value)}
                            disabled={!totalIncoming}
                            className={`input-field ${
                                !totalIncoming ? 'input-disabled' :
                                !isValid ? 'input-invalid' : 'input-valid'
                            }`}
                        />
                    </div>
                ))}
            </div>

            {totalIncoming && (
                <div className="validation-message">
                    {isValid 
                        ? <span className="valid-text">Valid distribution of vehicles</span>
                        : <span className="invalid-text">
                            Total vehicles from {incomingDirection} ({totalIncoming}) must equal sum of outgoing vehicles
                          </span>
                    }
                </div>
            )}
        </form>
    );

}

export default JunctionInput;