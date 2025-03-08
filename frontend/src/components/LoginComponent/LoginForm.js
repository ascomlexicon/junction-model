import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Array of valid user credentials
    const validCredentials = [
        { email: 'user1@example.com', password: 'password1' },
        { email: 'user2@example.com', password: 'password2' },
        { email: 'admin@junction.com', password: 'admin123' },
        {email: 'j@sh.com', password: 'j'}
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/MainPage');
    };

    return (
        <div className={styles.container}>
            <div className={styles.Title}>
                <h1>Junction Simulator</h1>
            </div>
            <div className={styles.Form}>
                <form onSubmit={handleSubmit} role="form">
                    {error && <div className={styles.error}>{error}</div>}
                    <div className={styles.input}>
                        <label htmlFor="email">Email:</label>
                        <input 
                            id="email" 
                            type="email" 
                            name="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.input}>
                        <label htmlFor="password">Password:</label>
                        <input 
                            id="password" 
                            type="password" 
                            name="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;