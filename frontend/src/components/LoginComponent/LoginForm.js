import React from 'react';
import { Link } from 'react-router-dom';


function LoginForm(){
    return (
        <form>
            <input type="text" placeholder="Enter Email" name="Email" required/>
            <input type="password" placeholder="Enter Password" name="Password" required/>
            <button><Link to = "/MainPage"> Login </Link></button>
        </form>
    )
}

export default LoginForm;