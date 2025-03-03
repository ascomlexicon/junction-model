import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './DirectionPrioritisation.css';
import SaveNextButton from '../ButtonComponents/SaveNextButton';
import BackButton from '../ButtonComponents/BackButton';
import ResetAllButton from '../ButtonComponents/ResetAllButton';
import ResetPrioritisationButton from '../ButtonComponents/ResetPrioritisationButton';

function DirectionPrioritisation({ setActiveStep, saveFormData, resetForm, resetAllForms, formData = {} }) {
  // Initialize state with passed formData or default values
  const [prioritisationData, setPrioritisationData] = useState(() => {
    // return Object.keys(formData).length > 0 ? formData : {
    //   enablePrioritisation: false,
    //   directions: [
    //     { id: 'north', content: 'North' },
    //     { id: 'south', content: 'South' },
    //     { id: 'east', content: 'East' },
    //     { id: 'west', content: 'West' }
    //   ]
    // };
    if (formData.enablePrioritisation) {
      return {
        enablePrioritisation: true,
        directions: formData.directionPrioritisation.map((direction, index) => ({ id: direction, content: direction }))
      };
    }
    return {
      enablePrioritisation: false,
      directions: [
        { id: 'north', content: 'North' },
        { id: 'south', content: 'South' },
        { id: 'east', content: 'East' },
        { id: 'west', content: 'West' }
      ]
    };
  });

  // Always valid since prioritisation is optional
  const [isValid, setIsValid] = useState(true);

  const handleenablePrioritisation = (e) => {
    setPrioritisationData(prev => ({
      ...prev,
      enablePrioritisation: e.target.checked
    }));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(prioritisationData.directions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setPrioritisationData(prev => ({
      ...prev,
      directions: items
    }));
  };

  // Convert direction prioritisation to required JSON format
  const formatLanePrioritiesToJSON = () => {
    let directionPrioritisation = [];
    if (!prioritisationData.enablePrioritisation) {
      return { enablePrioritisation: false, directionPrioritisation };
    }

    if (prioritisationData.enablePrioritisation) {
      directionPrioritisation = prioritisationData.directions.map(direction => direction.content);
    }

    return {
      enablePrioritisation: true,
      directionPrioritisation: directionPrioritisation
    };
  };

  // Handle button click events
  const handleSaveNext = () => {
    const formattedData = formatLanePrioritiesToJSON();
    saveFormData('directionPrioritisation', formattedData);
    setActiveStep(4); // Move to Summary step
  };

  const handleBack = () => {
    setActiveStep(2); // Go back to PedestrianCrossing
  };

  const handleResetChanges = () => {
    resetForm('directionPrioritisation');
    setPrioritisationData({
      enablePrioritisation: false,
      directions: [
        { id: 'north', content: 'North' },
        { id: 'south', content: 'South' },
        { id: 'east', content: 'East' },
        { id: 'west', content: 'West' }
      ]
    });
  };

  return (
    <div className="lane-prioritisation-container">
      <h2>Direction Prioritisation</h2>
      
      <div className="info-box">
        <h3>Info:</h3>
        <ul>
          <li>Set traffic priority for different directions</li>
          <li>Drag directions to reorder priority (top = highest, bottom = lowest)</li>
          <li>Higher priority lanes will receive longer green light duration</li>
        </ul>
      </div>

      <div className="prioritisation-controls">
        <div className="control-row">
          <label htmlFor="add-prioritisation">
            Add direction prioritisation:
            <input
              id="add-prioritisation"
              type="checkbox"
              checked={prioritisationData.enablePrioritisation}
              onChange={handleenablePrioritisation}
            />
          </label>
        </div>

        {prioritisationData.enablePrioritisation && (
          <div className="directions-container">
            <h3>Directions</h3>
            <p className="drag-instructions">Drag to reorder (top = highest priority, bottom = lowest)</p>
            
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="directions">
                {(provided) => (
                  <ul 
                    className="directions-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {prioritisationData.directions.map((direction, index) => (
                      <Draggable 
                        key={direction.id} 
                        draggableId={direction.id} 
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="direction-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="drag-handle">≡</div>
                            <span>{direction.content}</span>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            
            <div className="subject-to-change">
              <p>Subject to change based on traffic conditions</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Button container */}
      <div className="button-container">
        <BackButton onClick={handleBack} label="Back to Pedestrian Crossings" />
        <ResetPrioritisationButton onClick={handleResetChanges} />
        <ResetAllButton onClick={resetAllForms} />
        <SaveNextButton onClick={handleSaveNext} disabled={!isValid} />
      </div>
    </div>
  );
}

export default DirectionPrioritisation;