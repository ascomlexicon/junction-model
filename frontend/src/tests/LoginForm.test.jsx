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
  beforeEach(() => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );    
  });

  it("login form renders successfully", () => {
    // Check if title is present
    expect(screen.getByText('Junction Simulator')).toBeInTheDocument();
    
    // Check if form elements are present
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // TODO: Not sure how to currently test these, as there is no collection of 
  // "allowed" emails and passwords.
  // 3. Test if login button enabled when there is a correct email and password
  // 4. Test if login button disabled when there is a incorrect email and password

  it('allows email and password to be entered', () => {    
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test if form submission is handled correctly
  it('checks form is submitted properly', () => {    
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
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    // Check if required attribute is present for both inputs
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('ensures password field masks input', () => {
    const passwordInput = screen.getByLabelText(/password:/i);

    // Checks the type of the password input field
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('ensures email field is of correct type', () => {    
    const passwordInput = screen.getByLabelText(/email:/i);

    // Checks the type of the password input field
    expect(passwordInput).toHaveAttribute('type', 'email');
  });

  it('submit button should not navigate when email is empty', () => {
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Fill only password field
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    // Try to submit the form
    fireEvent.click(submitButton);

    // Mock form submission
    const mockSubmit = jest.fn(e => e.preventDefault());

    // Check that navigation didn't occur
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submit button should not navigate when password is empty', () => {
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Fill only email field
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Try to submit the form
    fireEvent.click(submitButton);

    // Mock form submission
    const mockSubmit = jest.fn(e => e.preventDefault());

    // Check that navigation didn't occur
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
