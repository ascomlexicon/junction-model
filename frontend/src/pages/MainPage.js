import React , { useState}from 'react';
import { Link } from "react-router-dom";
import JunctionForm from '../components/MainPageComponents/JunctionForm';
import '../styles/MainPage.css';
import Sidebar from '../components/MainPageComponents/SideBar';
import TrafficFlow from '../components/MainPageComponents/TrafficFlow';
// import LaneCustomizationForm from '../components/LaneCustomizationForm';
// import PedestrianCrossingsForm from '../components/PedestrianCrossingsForm';
// import LanePrioritizationForm from '../components/LanePrioritizationForm';
// import SummaryForm from '../components/SummaryForm';


function MainPage(){

    const [activeStep, setActiveStep] = useState(0);

    const renderForm = () => {
        switch (activeStep) {
            case 0:
                return <TrafficFlow />;
            // case 1:
            //     return <LaneCustomizationForm />;
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
    // <div className="container">
    //   <h1 className="main-title">Junction Simulator</h1>
    //   <div className="main-content">        
    //     <div className="traffic-flow-section">
    //         <p>Hello</p>
    //         <div className='input-form'>
    //             <JunctionForm/>
    //         </div>
    //       <div className="action-buttons">
    //         <button className="save-load-button">Save and Load</button>
    //         <button className="reset-all-button">Reset All</button>
    //       </div>
    //     </div>
        
    //     <div className="rankings-link">
    //       <Link to="/RankingsPage">See Junction Leaderboards</Link>
    //     </div>
    //   </div>
    // </div>
        <div className="container">
            <h1 className='main-title'>Junction Simulator</h1>
            <div className="junction-visual">
                <div className='image'>{/* Junction graphic */}IMAGE</div>
                <div className='Leaderboard'>See junction Leaderboard</div>
            </div>
            <div className='menu'>
                {/* <div className="input-form">
                    <JunctionForm/>
                </div> */}
                <Sidebar setActiveStep={setActiveStep} activeStep={activeStep} />
                <div className="main-form">
                    {renderForm()}
                </div>
                {/* <div className='bottom-row'>
                    <div className="action-buttons">
                        <button className="run-button">Run</button>
                        <button className="rankings-button">
                            <Link to="/RankingsPage">See Junction Rankings</Link>
                            <br/>
                            <Link to = "/">Login</Link>
                        </button>
                    </div>
                </div> */}
            </div>
        </div>

    )
}

export default MainPage