import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, Menu, X, User, LogOut, LayoutDashboard, ShoppingCart, FileText, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/benefits',  label: 'Benefits' },
    { to: '/process',   label: 'Process' },
    { to: '/pricing',   label: 'Pricing' },
    { to: '/locations', label: 'Locations' },
    { to: '/book-water',label: 'Book Water' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-circle">S</div>
          <div className="nav-logo-text">
            <span>AW</span> Alkaline Water
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                <LayoutDashboard size={15}/> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-sm" style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', borderRadius:50 }}>
                <LogOut size={15}/> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <hr style={{ borderColor: 'var(--glass-border)' }}/>
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-sm btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}
