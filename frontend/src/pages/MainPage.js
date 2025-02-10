import React from 'react';
import { Link } from "react-router-dom";
import JunctionForm from '../components/MainPageComponents/JunctionForm';


function MainPage(){
    return(
        <div>
        <h1>Tester Tester</h1>
        <JunctionForm/>
        <button> <Link to ="/RankingsPage"> RankingsPage </Link></button>
        <button> <Link to ="/"> Login </Link></button>
        </div>

    )
}

export default MainPage