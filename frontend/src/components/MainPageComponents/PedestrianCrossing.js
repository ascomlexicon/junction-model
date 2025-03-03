import React, { useState, useEffect } from 'react';
import './PedestrianCrossing.css';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import BackButton from '../ButtonComponents/BackButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';
import ResetCrossingsButton from '../ButtonComponents/ResetCrossingsButton';

function PedestrianCrossing({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) {
  // Initialize state with passed formData or default values
  const [crossingData, setCrossingData] = useState(() => {
    if (formData.isCrossings) {
      return {
        addCrossings: true,
        crossingDuration: formData.crossingDuration,
        requestsPerHour: formData.crossingRequestsPerHour,
      };
    }
    return {
      addCrossings: false,
      crossingDuration: '',
      requestsPerHour: '',
    };
  });

  const [isValid, setIsValid] = useState(true);

  // Check validity when form data changes
  useEffect(() => {
    validateForm();
  }, [crossingData]);

  const validateForm = () => {
    // If crossings aren't added, form is valid
    if (!crossingData.addCrossings) {
      setIsValid(true);
      return;
    }
    
    // If crossings are added, both duration and requests need values
    const durationValid = crossingData.crossingDuration !== '' && 
                          !isNaN(crossingData.crossingDuration) && 
                          crossingData.crossingDuration >= 5 && 
                          crossingData.crossingDuration <= 60;
                          
    const requestsValid = crossingData.requestsPerHour !== '' && 
                         !isNaN(crossingData.requestsPerHour) && 
                         crossingData.requestsPerHour >= 0 && 
                         crossingData.requestsPerHour <= 1000;
                         
    setIsValid(durationValid && requestsValid);
  };

  const handleAddCrossingsChange = (e) => {
    const checked = e.target.checked;
    setCrossingData(prev => ({
      ...prev,
      addCrossings: checked,
      crossingDuration: checked ? prev.crossingDuration : 0,
      requestsPerHour: checked ? prev.requestsPerHour : 0,
    }));
  };

  const handleCrossingDurationChange = (e) => {
    setCrossingData(prev => ({
      ...prev,
      crossingDuration: e.target.value
    }));
  };

  const handleRequestsPerHourChange = (e) => {
    setCrossingData(prev => ({
      ...prev,
      requestsPerHour: e.target.value
    }));
  };

  // Format lane data to match required JSON structure
  const formatPedestrianDataToJSON = () => {
    // Determine if there are pedestrian crossings
    const isCrossings = crossingData.addCrossings;

    // Add crossing duration and requests to JSON
    const crossingDuration = (() => {
      return parseInt(crossingData.crossingDuration);
    })();

    const crossingRequestsPerHour = (() => {
      return parseInt(crossingData.requestsPerHour);
    })();

    return {
      isCrossings,
      crossingDuration,
      crossingRequestsPerHour
    };
  };

  // Handle button click events
  const handleSaveNext = () => {
    if (isValid) {
      const formattedData = formatPedestrianDataToJSON(); // Formats data to JSON
      saveFormData('pedestrianCrossing', formattedData);
      setActiveStep(3); // Move to the next step (LanePrioritisation)
    }
  };

  const handleBack = () => {
    setActiveStep(1); // Go back to LaneCustomisation
  };

  const handleResetChanges = () => {
    resetForm('pedestrianCrossing');
    setCrossingData({
      addCrossings: false,
      crossingDuration: '',
      requestsPerHour: '',
    });
  };

  return (
    <div className="pedestrian-crossings-container">
      <h2>Pedestrian Crossings</h2>
      
      <div className="info-box">
        <h3>Info:</h3>
        <ul>
          <li>Pedestrian crossings allow safe passage across the junction</li>
          <li>Adding crossings may impact traffic flow and signal timing</li>
          <li>Crossing duration affects waiting time for vehicles</li>
        </ul>
      </div>

      <div className="crossing-controls">
        <div className="control-row">
          <label htmlFor="add-crossings">
            Add Crossings:
            <input
              id="add-crossings"
              type="checkbox"
              checked={crossingData.addCrossings}
              onChange={handleAddCrossingsChange}
            />
          </label>
        </div>

        {crossingData.addCrossings && (
          <>
            <div className="control-row">
              <label htmlFor="crossing-duration">
                Duration of Crossings (seconds):
                <input
                  id="crossing-duration"
                  type="number"
                  min="5"
                  max="60"
                  value={crossingData.crossingDuration}
                  onChange={handleCrossingDurationChange}
                  className={crossingData.addCrossings && (!crossingData.crossingDuration || crossingData.crossingDuration < 5 || crossingData.crossingDuration > 60) ? 'invalid' : 'valid'}
                />
              </label>
            </div>

            <div className="control-row">
              <label htmlFor="requests-per-hour">
                Crossing requests per hour:
                <input
                  id="requests-per-hour"
                  type="number"
                  min="0"
                  max="1000"
                  value={crossingData.requestsPerHour}
                  onChange={handleRequestsPerHourChange}
                  className={crossingData.addCrossings && (!crossingData.requestsPerHour || crossingData.requestsPerHour < 0 || crossingData.requestsPerHour > 1000) ? 'invalid' : 'valid'}
                />
              </label>
            </div>
          </>
        )}
      </div>
      
      {/* Button container */}
      <div className="button-container">
        <BackButton onClick={handleBack} label="Back to Lane Customisation" />
        <ResetCrossingsButton onClick={handleResetChanges} />
        <ResetAllButton onClick={resetAllForms} />
        <SaveNextButton onClick={handleSaveNext} disabled={!isValid} />
      </div>
    </div>
  );
}

export default PedestrianCrossing;