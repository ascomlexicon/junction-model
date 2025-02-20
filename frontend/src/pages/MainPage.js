import React from 'react';
import { Link } from "react-router-dom";
import JunctionForm from '../components/MainPageComponents/JunctionForm';
import '../styles/MainPage.css';


function MainPage(){
    return(
        <div className="container">
            <div className="junction-visual">
                {/* Junction graphic */}
                {/* TODO: For this branch, this will contain the JSON that was sent to the backend, 
                ensuring that data can be sent correctly */}
            </div>
            <div className="input-form">
                <JunctionForm/>
            </div>
            <div className='bottom-row'>
                <div className="action-buttons">
                    <button className="run-button">Run</button>
                    <button className="rankings-button">
                        <Link to="/RankingsPage">See Junction Rankings</Link>
                        <br/>
                        <Link to = "/">Login</Link>
                    </button>
                </div>
                <div className="progress-bar">
                {/* Progress bar component */}
                </div>
            </div>
        </div>

    )
}

export default MainPage