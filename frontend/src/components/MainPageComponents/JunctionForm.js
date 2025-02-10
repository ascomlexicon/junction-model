import React from 'react';
import JunctionInput from './JunctionInput';

function JunctionForm(){
   return(
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Junction Traffic Flow Model</h1>
        
        {/* Form for vehicles coming from North */}
        <JunctionInput
            incomingDirection="NorthBound"
            outgoingDirection1="South"
            outgoingDirection2="East"
            outgoingDirection3="West"
        />

        {/* Form for vehicles coming from South */}
        <JunctionInput
            incomingDirection="SouthBound"
            outgoingDirection1="North"
            outgoingDirection2="East"
            outgoingDirection3="West"
        />

        {/* Form for vehicles coming from East */}
        <JunctionInput
            incomingDirection="EastBound"
            outgoingDirection1="Extiing North"
            outgoingDirection2="South"
            outgoingDirection3="West"
        />

        {/* Form for vehicles coming from West */}
        <JunctionInput
            incomingDirection="WestBound"
            outgoingDirection1="North"
            outgoingDirection2="South"
            outgoingDirection3="East"
        />
    </div>
   )
}

export default JunctionForm;