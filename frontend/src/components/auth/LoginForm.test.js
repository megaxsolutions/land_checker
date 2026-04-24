import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { AuthContext } from '../../contexts/AuthContext';

function renderLoginForm(loginFn = jest.fn(), onSwitch = jest.fn()) {
  const authValue = {
    user: null,
    token: null,
    login: loginFn,
    register: jest.fn(),
    logout: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <LoginForm onSwitch={onSwitch} />
    </AuthContext.Provider>
  );
}

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    renderLoginForm();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows a validation error when fields are empty', async () => {
    renderLoginForm();
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    expect(await screen.findByText(/Please fill in all fields/i)).toBeInTheDocument();
  });

  it('calls login with email and password on submit', async () => {
    const loginFn = jest.fn().mockResolvedValue({ user: { id: 1 } });
    renderLoginForm(loginFn);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows error message when login fails', async () => {
    const loginFn = jest.fn().mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });
    renderLoginForm(loginFn);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'bad@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it('shows loading state while submitting', async () => {
    const loginFn = jest.fn(() => new Promise(() => {})); // never resolves
    renderLoginForm(loginFn);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Signing in/i)).toBeInTheDocument();
  });

  it('calls onSwitch when the create account link is clicked', () => {
    const onSwitch = jest.fn();
    renderLoginForm(jest.fn(), onSwitch);
    fireEvent.click(screen.getByRole('button', { name: /Create one/i }));
    expect(onSwitch).toHaveBeenCalledTimes(1);
  });
});
