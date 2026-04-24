import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function RegisterForm({ onSwitch }) {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="form-alert form-alert--error">{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="reg-name">Full name</label>
        <input
          id="reg-name"
          className="form-input"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Jane Smith"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">Email address</label>
        <input
          id="reg-email"
          className="form-input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          className="form-input"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
        <input
          id="reg-confirm"
          className="form-input"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button className="form-submit" type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <div className="form-switch">
        Already have an account?
        <button type="button" onClick={onSwitch}>Sign in</button>
      </div>
    </form>
  );
}
