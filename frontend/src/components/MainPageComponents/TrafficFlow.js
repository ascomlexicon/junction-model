import React from 'react';
import JunctionInput from './JunctionInput';
import './TrafficFlow.css';

function TrafficFlow(){
    return(
     <div className="junction-forms-container">
         <h1 className="junction-title">Junction Traffic Flow Model</h1>
         
         <div className="forms-grid">
             {/* First row */}
             <div className="form-cell">
                 <JunctionInput
                     incomingDirection="NorthBound"
                     outgoingDirection1="South"
                     outgoingDirection2="East"
                     outgoingDirection3="West"
                 />
             </div>
             <div className="form-cell">
                 <JunctionInput
                     incomingDirection="SouthBound"
                     outgoingDirection1="North"
                     outgoingDirection2="East"
                     outgoingDirection3="West"
                 />
             </div>
             
             {/* Second row */}
             <div className="form-cell">
                 <JunctionInput
                     incomingDirection="EastBound"
                     outgoingDirection1="North"
                     outgoingDirection2="South"
                     outgoingDirection3="West"
                 />
             </div>
             <div className="form-cell">
                 <JunctionInput
                     incomingDirection="WestBound"
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