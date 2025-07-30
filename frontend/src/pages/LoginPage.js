import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImage from '../../src/data/img/logoorder.png';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/orders');
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f6fa'
        }}>
            <form
                onSubmit={handleLogin}
                style={{
                    background: '#fff',
                    padding: '32px 28px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                    minWidth: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <img
                        src={logoImage}
                        alt="Logo"
                        style={{ height: '100px', objectFit: 'contain' }}
                    />
                </div>
                <h2 style={{ margin: 0, textAlign: 'center', color: '#2d3436' }}>Login</h2>
                {error && (
                    <div style={{
                        color: '#d63031',
                        background: '#ffeaea',
                        padding: '8px',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #dfe6e9',
                        fontSize: '16px'
                    }}
                    autoFocus
                    autoComplete="username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #dfe6e9',
                        fontSize: '16px'
                    }}
                    autoComplete="current-password"
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#0984e3',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;