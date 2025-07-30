import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { username, password });
            setSuccess('Registered successfully. Please login.');
            setError('');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'
        }}>
            <div style={{
                background: '#fff',
                padding: '2.5rem 2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                minWidth: '340px',
                maxWidth: '380px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {/* Logo Example (SVG) */}
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="24" fill="#4F8EF7" />
                        <text x="24" y="30" textAnchor="middle" fontSize="20" fill="#fff" fontFamily="Arial">REM</text>
                    </svg>
                </div>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1.2rem',
                    fontWeight: 600,
                    color: '#333'
                }}>Create Account</h2>
                {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                {success && <p style={{ color: '#27ae60', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 500 }}>Username</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                borderRadius: '6px',
                                border: '1px solid #dbeafe',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                borderRadius: '6px',
                                border: '1px solid #dbeafe',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: '#4F8EF7',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        Register
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.2rem', color: '#555' }}>
                    Already have an account?{' '}
                    <span
                        style={{ color: '#4F8EF7', cursor: 'pointer', fontWeight: 500 }}
                        onClick={() => navigate('/')}
                    >
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
