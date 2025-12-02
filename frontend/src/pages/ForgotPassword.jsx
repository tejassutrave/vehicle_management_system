import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await authAPI.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content" style={{ gridTemplateColumns: '1fr' }}>
                <div className="login-form-section">
                    <div className="login-form-wrapper">
                        <h2>Forgot Password?</h2>
                        <p>Enter your email to receive a password reset link</p>

                        {error && <div className="error-message">{error}</div>}

                        {success ? (
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid var(--success)',
                                color: 'var(--success)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem'
                            }}>
                                <p>Password reset link has been sent to your email!</p>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                    Please check your inbox and follow the instructions.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="register-link">
                            Remember your password? <Link to="/login">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
