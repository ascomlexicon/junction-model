import React, { useState, useEffect } from 'react';
import '../styles/MainPage.css';
import Sidebar from '../components/MainPageComponents/SideBar';
import TrafficFlow from '../components/MainPageComponents/TrafficFlow';
import LaneCustomisation from '../components/MainPageComponents/LaneCustomisation';
import PedestrianCrossing from '../components/MainPageComponents/PedestrianCrossing';
import LanePrioritisation from '../components/MainPageComponents/LanePrioritisation';
import Summary from '../components/MainPageComponents/Summary';
import JSONViewer from './JSONViewer';

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
    
    // Initialize complete JSON structure
    // See jsonFileFormat.json for notes on structure
    const [completeJSON, setCompleteJSON] = useState({
      leftTurnLanes: {},
      lanesEntering: {},
      lanesExiting: {},
      isBusOrCycle: "none",
      busCycleLaneDuration : {
        "vphSpecialNorth": 0,
        "vphSpecialSouth": 0,
        "vphSpecialEast": 0,
        "vphSpecialWest": 0
      },
      enablePrioritisation: false,
      lanePrioritisation: [],
      isCrossings: false,
      crossingDuration: 0,
      crossingRequestsPerHour: 0,
      vphNorth: {},
      vphSouth: {},
      vphEast: {},
      vphWest: {},
      junctionImage: null
    });
    
    // State to store form data
    const [formData, setFormData] = useState({
      trafficFlow: {},
      laneCustomisation: {},
      pedestrianCrossing: {},
      lanePrioritisation: {},
      junctionView: {}
    });
    
    // Update JSON whenever form data changes
    useEffect(() => {
      updateJSON();
    }, [formData]);

    // Function to update complete JSON
    const updateJSON = () => {
      const newJSON = { ...completeJSON };
      
      // Update with traffic flow data if it exists
      if (Object.keys(formData.trafficFlow).length > 0) {
        Object.assign(newJSON, formData.trafficFlow);
      }
      
      if (Object.keys(formData.laneCustomisation).length > 0) {
        // Update lane customisation fields
        const {
            leftTurnLanes,
            lanesEntering,
            lanesExiting,
            isBusOrCycle,
            busCycleLaneDuration
        } = formData.laneCustomisation;
        
        Object.assign(newJSON, {
            leftTurnLanes,
            lanesEntering,
            lanesExiting,
            isBusOrCycle,
            busCycleLaneDuration
        });
      }

      if (Object.keys(formData.pedestrianCrossing).length > 0) {
        // Update pedestrian crossing fields
        const {
            isCrossings,
            crossingDuration,
            crossingRequestsPerHour
        } = formData.pedestrianCrossing;
        
        Object.assign(newJSON, {
          isCrossings,
          crossingDuration,
          crossingRequestsPerHour,
        });
      }

      if (Object.keys(formData.lanePrioritisation).length > 0) {
        const {
            enablePrioritisation,
            lanePrioritisation,
        } = formData.lanePrioritisation;

        // Update lane prioritisation field
        Object.assign(newJSON, {
          enablePrioritisation,
          lanePrioritisation
        });
      }

      if (Object.keys(formData.junctionView).length > 0) {
        const { junctionImage } = formData.junctionView;

        Object.assign(newJSON, {
          junctionImage
        });
      }

      // TODO: MAKE THIS AN IF...ELSE IF...ELSE WHERE THE ELSE HANDLES THE JUNCTION IMAGE
      
      setCompleteJSON(newJSON);
    };

    // Save data associated with each form
    const saveFormData = (formName, data) => {
      setFormData(prev => ({
        ...prev,
        [formName]: data
      }));
    };
    
    // Reset specific form and JSON data for the form
    const resetForm = (formName) => {
      const newJSON = { ...completeJSON };

      // Don't need to reset for the junctionView case, as this image is only saved 
      // just before the data is sent to the backend
      switch (formName) {
        case 'trafficFlow':
          newJSON.vphNorth = {};
          newJSON.vphSouth = {};
          newJSON.vphEast = {};
          newJSON.vphWest = {};
          break;
        case 'laneCustomisation':
          newJSON.leftTurnLanes = {};
          newJSON.lanesEntering = {};
          newJSON.lanesExiting = {};
          newJSON.isBusOrCycle = "none";
          newJSON.busCycleLaneDuration = {
            "vphSpecialNorth": 0,
            "vphSpecialSouth": 0,
            "vphSpecialEast": 0,
            "vphSpecialWest": 0
          };
          break;
        case 'pedestrianCrossing':
          newJSON.isCrossings = false;
          newJSON.crossingDuration = 0;
          newJSON.crossingRequestsPerHour = 0;
          break;
        case 'lanePrioritisation':
          newJSON.enablePrioritisation = false;
          newJSON.lanePrioritisation = [];
          break;
        default:
          break;
      }

      setCompleteJSON(newJSON);

      setFormData(prev => ({
        ...prev,
        [formName]: {}
      }));
    };
    
    // Reset all forms, as well as the JSON file being configured
    const resetAllForms = () => {
      // Resets all JSON information
      setCompleteJSON({
        leftTurnLanes: {},
        lanesEntering: {},
        lanesExiting: {},
        isBusOrCycle: "none",
        busCycleLaneDuration : {
          "vphSpecialNorth": 0,
          "vphSpecialSouth": 0,
          "vphSpecialEast": 0,
          "vphSpecialWest": 0
        },
        lanePrioritisation: [],
        isCrossings: false,
        crossingDuration: 0,
        crossingRequestsPerHour: 0,
        vphNorth: {},
        vphSouth: {},
        vphEast: {},
        vphWest: {},
        junctionImage: null
      });

      setFormData({
        trafficFlow: {},
        laneCustomisation: {},
        pedestrianCrossing: {},
        lanePrioritisation: {},
        junctionView: {}
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
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData = {completeJSON}
                  />
                );
            case 1:
                return (
                  <LaneCustomisation 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData={completeJSON}
                  />
                );
            case 2:
                return (
                  <PedestrianCrossing 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData={completeJSON}
                  />
                );
            case 3:
                return (
                  <LanePrioritisation 
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
                    resetForm={resetForm}
                    resetAllForms={resetAllForms}
                    formData={completeJSON}
                  />
                );
            case 4:
                return (
                  <Summary 
                    formData={completeJSON}
                    setActiveStep={setActiveStep}
                    saveFormData={saveFormData}
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
                {/* Junction graphic */}
            </div>
            <div className='menu'>
                <Sidebar setActiveStep={setActiveStep} activeStep={activeStep} />
                <div className="main-form">
                    {renderForm()}
                </div>
            </div>
            <JSONViewer data={completeJSON} />
        </div>
    );
}

export default MainPage;