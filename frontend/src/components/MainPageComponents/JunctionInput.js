import React, { useState, useEffect } from 'react';
import './JunctionInput.css'

function JunctionInput({ 
  incomingDirection,    
	outgoingDirection1,   
	outgoingDirection2,   
	outgoingDirection3,
	onUpdate,            // Add onUpdate prop
	values              // Add values prop for controlled inputs
}) {
	// Initialize state from props
	const [totalIncoming, setTotalIncoming] = useState(values?.enter || '');
	const [outgoingFlows, setOutgoingFlows] = useState({
		[outgoingDirection1.toLowerCase()]: values?.[outgoingDirection1.toLowerCase()] || '',
		[outgoingDirection2.toLowerCase()]: values?.[outgoingDirection2.toLowerCase()] || '',
		[outgoingDirection3.toLowerCase()]: values?.[outgoingDirection3.toLowerCase()] || ''
	});
	const [isValid, setIsValid] = useState(false);

	// Validate totals and notify parent of changes
	useEffect(() => {
		const sum = Object.values(outgoingFlows)
			.reduce((acc, val) => acc + (parseInt(val) || 0), 0);
		const isValidTotal = sum === parseInt(totalIncoming);
		setIsValid(isValidTotal);

		// Only update parent if we have valid numbers
		if (isValidTotal && totalIncoming) {
			onUpdate({enter: totalIncoming, ...outgoingFlows});
		}
	}, [outgoingFlows, totalIncoming, onUpdate]);

	// Handle changes to outgoing flow inputs
	const handleOutgoingChange = (direction, value) => {
		if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
			const newFlows = {
				...outgoingFlows,
				[direction.toLowerCase()]: value
			};
			setOutgoingFlows(newFlows);
		}
	};

	// Handle total incoming vehicles change
	const handleTotalChange = (value) => {
		if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
			setTotalIncoming(value);
		}
	};

	return (
		<form className="junction-form">
			<div className="incoming-section">
				<h3 className="direction-heading">Entering</h3>
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
					{ direction: outgoingDirection1 },
					{ direction: outgoingDirection2 },
					{ direction: outgoingDirection3 }
				].map(({ direction }) => (
					<div key={direction} className="direction-input">
						<label className="direction-label">
							<span className="label-text">Exit {direction}:</span>
						</label>
						<input
							type="text" 
							value={outgoingFlows[direction.toLowerCase()]}
							onChange={(e) => handleOutgoingChange(direction, e.target.value)}
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