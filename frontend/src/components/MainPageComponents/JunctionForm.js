import React, { useState, useEffect } from 'react';
import JunctionInput from './JunctionInput';
import './JunctionForm.css';
import { mockJunctionData } from '../../mockJunctionData';

function JunctionForm(){

  const [junctionVPHData, setJunctionVPHData] = useState([]);

  useEffect(() => {
    const fetchJunctionData = async () => {
        const res = await fetch(___); // TODO: Add the API endpoint
        const data = await res.json();
        setJunctionVPHData(data);
    }
    fetchJunctionData();
  }, []);

  const submitVPHData = async () => {
    const myData = {
      inNorth: 200,
      northToSouth: 100,
      northToEast: 50,
      northToWest: 50,
      inSouth: 100,
      southToNorth: 50,
      southToEast: 25,
      southToWest: 25,
      inEast: 150,
      eastToNorth: 75,
      eastToSouth: 25,
      eastToWest: 50,
      inWest: 300,
      westToNorth: 150,
      westToSouth: 100,
      westToEast: 50
    }

    // TODO: Add the API endpoint
    const res = await fetch(___, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(myData)
    });

    const data = await res.json();
    console.log(data);
  }

  return(
  <div className="junction-forms-container">
    <h1 className="junction-title">Junction Traffic Flow Model</h1>
    <button onClick = { submitVPHData }>Submit</button>
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
          outgoingDirection1="Exiting North"
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

export default JunctionForm;