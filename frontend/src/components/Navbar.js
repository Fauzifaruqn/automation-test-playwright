import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 2rem',
            background: '#1a202c',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
        }}>
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src="/logo192.png"
                    alt="Logo"
                    style={{ height: 40, marginRight: 12 }}
                />
                <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>REM Jobs</span>
            </div>

            {/* Links Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {!token && (
                    <>
                        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Register</Link>
                    </>
                )}
                {token && (
                    <>
                        <Link to="/orders" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Orders</Link>
                        <button
                            onClick={logout}
                            style={{
                                marginLeft: 10,
                                padding: '6px 16px',
                                background: '#e53e3e',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
