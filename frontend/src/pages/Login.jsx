import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    // Demo accounts data
    const demoAccounts = [
        {
            role: 'Fleet Owner',
            email: 'owner@fleet.com',
            icon: '🏢'
        },
        {
            role: 'Manager',
            email: 'manager@fleet.com',
            icon: '👔'
        },
        {
            role: 'Driver',
            email: 'driver@fleet.com',
            icon: '🚗'
        }
    ];

    const handleDemoLogin = (email) => {
        setFormData({
            email: email,
            password: 'password123'
        });
    };

    return (
        <div className="login-container">
            <div className="login-content">
                {/* Hero Section */}
                <div className="login-hero">
                    <div className="hero-logo">
                        <div className="logo-icon">🚗</div>
                        <h1>
                            Vehicle<span className="gradient-text">Tracker</span>
                        </h1>
                    </div>
                    <h2>Smart Fleet & Vehicle Management</h2>
                    <p>Manage vehicles with tracking, analytics, reminders and more.</p>

                    {/* Demo Accounts */}
                    <div className="demo-accounts">
                        <h3>Try Demo Accounts</h3>
                        <div className="demo-cards">
                            {demoAccounts.map((account, index) => (
                                <div
                                    key={index}
                                    className="demo-card"
                                    onClick={() => handleDemoLogin(account.email)}
                                >
                                    <div className="demo-icon">{account.icon}</div>
                                    <div className="demo-info">
                                        <h4>{account.role}</h4>
                                        <p>{account.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="demo-note">Click any card to auto-fill credentials</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="login-form-section">
                    <div className="login-form-wrapper">
                        <h2>Welcome Back</h2>
                        <p>Sign in to continue</p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="register-link">
                            Don't have an account? <Link to="/register">Create one</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
