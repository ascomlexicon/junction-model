import React from "react";
import { useLocation } from "react-router-dom";
import JunctionRankings from "../components/RankingsPageComponents/JunctionRankings";

function RankingsPage(){
    const location = useLocation();
    const junctionData = location.state;

    return(
        <JunctionRankings clickedJunction={junctionData}/>
    )
}


export default RankingsPage;