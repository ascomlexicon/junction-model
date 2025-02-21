import React, { useState } from 'react';
import { Link } from "react-router-dom";
import JunctionForm from '../components/MainPageComponents/JunctionForm';
import '../styles/MainPage.css';
import Sidebar from '../components/MainPageComponents/SideBar';
import TrafficFlow from '../components/MainPageComponents/TrafficFlow';
import LaneCustomisation from '../components/MainPageComponents/LaneCustomisation';
// import PedestrianCrossingsForm from '../components/PedestrianCrossingsForm';
// import LanePrioritizationForm from '../components/LanePrioritizationForm';
// import SummaryForm from '../components/SummaryForm';

// New component for instructions
const InstructionsPage = () => {
  return (
    <div className="instructions-container">
      <h2>Welcome to Junction Simulator</h2>
      <p>This tool helps you design and simulate traffic junctions to optimize flow and safety.</p>
      <p>To get started:</p>
      <ol>
        <li>Use the sidebar to navigate through different configuration steps</li>
        <li>Start with Traffic Flow settings to configure junction types and traffic patterns</li>
        <li>Customize lane configurations in the Lane Customisation section</li>
        <li>View your completed junction in the visual display area above</li>
      </ol>
      <p>Click any option in the sidebar to begin designing your junction.</p>
    </div>
  );
};

function MainPage() {
    const [activeStep, setActiveStep] = useState(-1); // Start at -1 for instructions

    const renderForm = () => {
        switch (activeStep) {
            case -1:
                return <InstructionsPage />;
            case 0:
                return <TrafficFlow />;
            case 1:
                return <LaneCustomisation />;
            // case 2:
            //     return <PedestrianCrossingsForm />;
            // case 3:
            //     return <LanePrioritizationForm />;
            // case 4:
            //     return <SummaryForm />;
            default:
                return <p>h</p>;
        }
    };

    return(
        <div className="container">
            <h1 className='main-title'>Junction Simulator</h1>
            <div className="junction-visual">
                <div className='image'>{/* Junction graphic */}IMAGE</div>
                <div className='Leaderboard'>See junction Leaderboard</div>
            </div>
            <div className='menu'>
                <Sidebar setActiveStep={setActiveStep} activeStep={activeStep} />
                <div className="main-form">
                    {renderForm()}
                </div>
            </div>
        </div>
    )
}

export default MainPage