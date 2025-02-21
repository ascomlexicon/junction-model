import React from 'react';
import JunctionInput from './JunctionInput';
import './TrafficFlow.css';

function TrafficFlow(){
    return(
     <div className="junction-forms-container">
         <h1 className="junction-title">Junction Traffic Flow Model</h1>
        <div classname= "instructions">
            <h2>Instructions</h2>
            <ul>
                <li>Restrictions on this page</li>
                <li>Values must be greater then 0</li>
            </ul>
        </div>
         <div className="forms-grid">
             {/* First row */}
             <div className="form-cell">
                <h1>North</h1>
                 <JunctionInput
                     incomingDirection="Entering"
                     outgoingDirection1="South"
                     outgoingDirection2="East"
                     outgoingDirection3="West"
                 />
             </div>
             <div className="form-cell">
                <h1>South</h1>
                 <JunctionInput
                     incomingDirection="Entering"
                     outgoingDirection1="North"
                     outgoingDirection2="East"
                     outgoingDirection3="West"
                 />
             </div>
             
             {/* Second row */}
             <div className="form-cell">
                <h1>East</h1>
                 <JunctionInput
                     incomingDirection="Entering"
                     outgoingDirection1="North"
                     outgoingDirection2="South"
                     outgoingDirection3="West"
                 />
             </div>
             <div className="form-cell">
                <h1>West</h1>
                 <JunctionInput
                     incomingDirection="Entering"
                     outgoingDirection1="North"
                     outgoingDirection2="South"
                     outgoingDirection3="East"
                 />
             </div>
         </div>
     </div>
    );
 }
 export default TrafficFlow;