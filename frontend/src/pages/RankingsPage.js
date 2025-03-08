import React from "react";
import { useLocation } from "react-router-dom";
import JunctionRankings from "../components/RankingsPageComponents/JunctionRankings";

function RankingsPage(){
    const location = useLocation();
    const junctionData = location.state.clickedJunction;
    const fromSummary = location.state.fromSummary;

    // console.log("Received junction data:", junctionData);
    // console.log("Coming from summary page:", fromSummary);

    return(
        <JunctionRankings clickedJunction={junctionData} fromSummary={fromSummary}/>
    )
}


export default RankingsPage;