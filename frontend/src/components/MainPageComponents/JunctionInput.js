import React, { useState, useEffect } from 'react';

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
        <form className="p-4 max-w-md mx-auto border rounded shadow-sm mb-6">
            <div className="mb-6">
                <h3 className="font-medium mb-2">
                    Traffic {incomingDirection}
                </h3>
                <input
                    type="text"
                    value={totalIncoming}
                    onChange={(e) => handleTotalChange(e.target.value)}
                    placeholder={`Total vehicles ${incomingDirection}`}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div className="space-y-4">
                {/* Map through outgoing directions to create inputs */}
                {[
                    { key: 'direction1', name: outgoingDirection1 },
                    { key: 'direction2', name: outgoingDirection2 },
                    { key: 'direction3', name: outgoingDirection3 }
                ].map(({ key, name }) => (
                    <div key={key}>
                        <label className="block mb-2">
                            <span className="font-medium">Exiting {name}:</span>
                        </label>
                        <input
                            type="text"
                            value={outgoingFlows[key]}
                            onChange={(e) => handleOutgoingChange(key, e.target.value)}
                            // placeholder={`Number of vehicles to ${name}`}
                            disabled={!totalIncoming}
                            className={`w-full border rounded px-3 py-2 ${
                                !totalIncoming ? 'bg-gray-100' :
                                !isValid ? 'border-red-300' : 'border-green-300'
                            }`}
                        />
                    </div>
                ))}
            </div>

            {totalIncoming && (
                <div className="mt-4 text-sm">
                    {isValid 
                        ? <span className="text-green-600">Valid distribution of vehicles</span>
                        : <span className="text-red-600">
                            Total vehicles from {incomingDirection} ({totalIncoming}) must equal sum of outgoing vehicles
                          </span>
                    }
                </div>
            )}
        </form>
    );
}

export default JunctionInput;