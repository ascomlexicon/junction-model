import React, { useState } from 'react';
import '../styles/MainPage.css';
import Sidebar from '../components/MainPageComponents/SideBar';
import TrafficFlow from '../components/MainPageComponents/TrafficFlow';
import LaneCustomisation from '../components/MainPageComponents/LaneCustomisation';
import PedestrianCrossing from '../components/MainPageComponents/PedestrianCrossing';
import LanePrioritisation from '../components/MainPageComponents/LanePrioritisation';
import Summary from '../components/MainPageComponents/Summary';

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
    const [activeStep, setActiveStep] = useState(-1);
    
    // State to store form data
    const [formData, setFormData] = useState({
      trafficFlow: {},
      laneCustomisation: {},
      pedestrianCrossing: {},
      lanePrioritisation: {}
    });
    
    // Save form data
    const saveFormData = (formName, data) => {
      setFormData(prev => ({
        ...prev,
        [formName]: data
      }));
    };
    
    // Reset specific form
    const resetForm = (formName) => {
      setFormData(prev => ({
        ...prev,
        [formName]: {}
      }));
    };
    
    // Reset all forms
    const resetAllForms = () => {
      setFormData({
        trafficFlow: {},
        laneCustomisation: {},
        pedestrianCrossing: {},
        lanePrioritisation: {}
      });
      // Optionally navigate back to first step
      setActiveStep(0);
    };

    const renderForm = () => {
        switch (activeStep) {
            case -1:
                return <InstructionsPage />;
            case 0:
                return (
                  <TrafficFlow 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetAllForms={resetAllForms}
                    formData={formData.trafficFlow}
                  />
                );
            case 1:
                return (
                  <LaneCustomisation 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData={formData.laneCustomisation}
                  />
                );
            case 2:
                return (
                  <PedestrianCrossing 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData={formData.pedestrianCrossing}
                  />
                );
            case 3:
                return (
                  <LanePrioritisation 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData={formData.lanePrioritisation}
                  />
                );
            case 4:
                return (
                  <Summary 
                    formData={formData}
                    setActiveStep={setActiveStep}
                  />
                );
            default:
                return <p>Unknown step</p>;
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
    );
}

export default MainPage;