import React from 'react';
import './JunctionInput.css';

function JunctionInput({
	incomingDirection,
	outgoingDirection1,
	outgoingDirection2,
	outgoingDirection3,
	onUpdate,
	values
}) {
	// Calculate validation status directly from props
	const calculateValidation = () => {
		const enter = parseInt(values.enter) || 0;
		const outTotal = (parseInt(values[outgoingDirection1.toLowerCase()]) || 0) +
											(parseInt(values[outgoingDirection2.toLowerCase()]) || 0) +
											(parseInt(values[outgoingDirection3.toLowerCase()]) || 0);
		return enter === outTotal && enter > 0;
	};

	const isValid = calculateValidation();

	// Handle changes to outgoing flow inputs
	const handleOutgoingChange = (direction, value) => {
		if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
			const newValues = {
				...values,
				[direction.toLowerCase()]: value === '' ? '' : parseInt(value)
			};
			onUpdate(newValues);
		}
	};

	// Handle total incoming vehicles change
	const handleTotalChange = (value) => {
		if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
			onUpdate({
				...values,
				enter: value === '' ? '' : parseInt(value)
			});
		}
	};

	return (
		<form className="junction-form">
			<div className="incoming-section">
				<h3 className="direction-heading">Entering</h3>
				<input
					type="number"
					value={values.enter}
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
							type="number"
							value={values[direction.toLowerCase()]}
							onChange={(e) => handleOutgoingChange(direction, e.target.value)}
							disabled={!values.enter}
							className={`input-field ${
								!values.enter ? 'input-disabled' :
								!isValid ? 'input-invalid' : 'input-valid'
							}`}
						/>
					</div>
				))}
			</div>
			{values.enter && (
				<div className="validation-message">
					{isValid
						? <span className="valid-text">Valid distribution of vehicles</span>
						: <span className="invalid-text">
								Total vehicles from {incomingDirection} ({values.enter}) must equal sum of outgoing vehicles
							</span>
					}
				</div>
			)}
		</form>
	);
}

export default JunctionInput;