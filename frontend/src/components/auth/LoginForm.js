import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function LoginForm({ onSwitch }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="form-alert form-alert--error">{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">Email address</label>
        <input
          id="login-email"
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
        <label className="form-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="form-input"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button className="form-submit" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <div className="form-switch">
        Don&apos;t have an account?
        <button type="button" onClick={onSwitch}>Create one</button>
      </div>
    </form>
  );
}
