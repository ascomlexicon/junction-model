import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './LanePrioritisation.css';

function LanePrioritisation() {
  const [enablePrioritization, setEnablePrioritization] = useState(false);
  const [directions, setDirections] = useState([
    { id: 'north', content: 'North' },
    { id: 'south', content: 'South' },
    { id: 'east', content: 'East' },
    { id: 'west', content: 'West' }
  ]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(directions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setDirections(items);
  };

  return (
    <div className="lane-prioritization-container">
      <h2>Lane Prioritization</h2>
      
      <div className="info-box">
        <h3>Info:</h3>
        <ul>
          <li>Set traffic priority for different directions</li>
          <li>Drag directions to reorder priority (top = highest, bottom = lowest)</li>
          <li>Higher priority lanes will receive longer green light duration</li>
        </ul>
      </div>

      <div className="prioritization-controls">
        <div className="control-row">
          <label htmlFor="add-prioritization">
            Add direction prioritization:
            <input
              id="add-prioritization"
              type="checkbox"
              checked={enablePrioritization}
              onChange={(e) => setEnablePrioritization(e.target.checked)}
            />
          </label>
        </div>

        {enablePrioritization && (
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
                    {directions.map((direction, index) => (
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
    </div>
  );
}

export default LanePrioritisation;