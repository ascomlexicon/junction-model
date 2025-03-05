import React, { useState } from 'react';
import './SideBar.css';

const Sidebar = ({ setActiveStep, activeStep }) => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const menuItems = [
    { label: 'Traffic Flow', step: 0 },
    { label: 'Lane Customisation', step: 1 },
    { label: 'Pedestrian Crossing', step: 2 },
    { label: 'Direction Prioritisation', step: 3 },
    { label: 'Summary', step: 4 },
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.step}
            data-number={`0${item.step + 1}`}
            className={`
              sidebar-item 
              ${activeStep === item.step ? 'active' : ''} 
              ${item.step > activeStep && item.step !== 0 ? 'disabled' : ''}
            `}
            onClick={() => {
              if (item.step <= activeStep || item.step === 0) {
                setActiveStep(item.step);
              }
            }}
            onMouseEnter={() => {
              if (item.step > activeStep && item.step !== 0) {
                setHoveredStep(item.step);
              }
            }}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <span>{item.label}</span>
            
            {hoveredStep === item.step && (
              <div className="tooltip">
                <strong>LOCKED: </strong>  
                Please complete earlier sections to unlock {item.label}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;