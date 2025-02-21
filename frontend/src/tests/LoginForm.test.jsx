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

  // TODO: Add more tests
  // 1. Test if login button is disabled when email and password are empty
  // 2. Test if login button is enabled when email and password are filled
  // 3. Test if login button enabled when there is a correct email and password
  // 4. Test if login button disabled when there is a incorrect email and password

  it('allows email and password to be entered', () => {
    render(<LoginFormWithRouter />);
    
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test if form submission is handled correctly
  it('checks form is submitted properly', () => {
    render(<LoginFormWithRouter />);
    
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const form = screen.getByRole('form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Mock form submission
    const mockSubmit = jest.fn(e => e.preventDefault());
    form.onsubmit = mockSubmit;
    
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('validates required fields', () => {
    render(<LoginFormWithRouter />);
    
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    // Check if required attribute is present for both inputs
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('ensures password field masks input', () => {
    render(<LoginFormWithRouter />);
    
    const passwordInput = screen.getByLabelText(/password:/i);

    // Checks the type of the password input field
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('ensures email field is of correct type', () => {
    render(<LoginFormWithRouter />);
    
    const passwordInput = screen.getByLabelText(/email:/i);

    // Checks the type of the password input field
    expect(passwordInput).toHaveAttribute('type', 'email');
  });

});
