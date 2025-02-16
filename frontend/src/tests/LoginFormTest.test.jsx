import { render, screen } from '@testing-library/react';
import LoginForm from '../components/LoginComponent/LoginForm';
import { BrowserRouter } from 'react-router-dom';

test("Login Form renders successfully", () => {
    render(
        <BrowserRouter>
            <LoginForm/>
        </BrowserRouter>
    );

    const title = screen.getByText(/junction simulator/i);
    expect(title).toBeInTheDocument();

    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
});