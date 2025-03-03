import React from 'react';
import './SideBar.css';

const Sidebar = ({ setActiveStep, activeStep }) => {
  // Define menu items with their labels and corresponding step numbers
  const menuItems = [
    { label: 'Traffic Flow', step: 0 },
    { label: 'Lane Customisation', step: 1 },
    { label: 'Pedestrian Crossing', step: 2 },
    { label: 'Direction Prioritisation', step: 3 },
    { label: 'Summary', step: 4 }
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.step}
            className={`sidebar-item ${activeStep === item.step ? 'active' : ''} ${
              (item.step > activeStep && item.step !== 0) ? 'disabled' : ''
            }`}
            onClick={() => {
                // We only want to be able to click back to previous sections or stay on current
                if (item.step <= activeStep || item.step === 0) {
                  setActiveStep(item.step);
                }
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

