import React from 'react';
import './SideBar.css';

const Sidebar = ({ setActiveStep, activeStep }) => {
    const steps = [
        "Traffic Flow",
        "Lane Customization",
        "Pedestrian Crossings",
        "Lane Prioritization",
        "Summary"
    ];

    return (
        <div className="sidebar">
            <ul>
                {steps.map((step, index) => (
                    <li 
                        key={index} 
                        className={activeStep === index ? "active" : ""} 
                        onClick={() => setActiveStep(index)}
                        data-number={index + 1}
                    >
                        <span>{step}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;