import { render, screen, fireEvent, getByRole } from '@testing-library/react';
import LoginForm from '../components/LoginComponent/LoginForm';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const LoginFormWithRouter = () => (
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
);

describe(LoginForm, () => {
    it("login form renders successfully", () => {
        render(<LoginFormWithRouter />);

        // Check if title is present
        expect(screen.getByText('Junction Simulator')).toBeInTheDocument();
        
        // Check if form elements are present
        expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
});
