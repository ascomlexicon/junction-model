import React from "react";
import JunctionRankings from "../components/RankingsPageComponents/JunctionRankings";

function RankingsPage({junctionData}){
    return(
        <JunctionRankings firstConfiguredJunction={junctionData}/>
    )
}


export default RankingsPage;