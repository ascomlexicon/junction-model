import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginForm.module.css';


function LoginForm() {
    return (
        <div className={styles.container}>
            <div className={styles.Title}>
                <h1>Junction Simulator</h1>
            </div>
            <div className={styles.Form}>
                <form>
                    <div className={styles.input}>
                        <label>Username:</label>
                        <input type="text" name="Email" required/>
                    </div>
                    <div className={styles.input}>
                        <label>Password:</label>
                        <input type="password" name="Password" required/>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button>
                            <Link to="/MainPage">Login</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;