import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Droplets, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 💧`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login error details:', err);

      let errorMessage = 'Login failed. Please try again.';

      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const serverMessage = err.response.data?.message;

        if (status === 401) {
          errorMessage = serverMessage || 'Invalid email or password. Please check your credentials.';
        } else if (status === 404) {
          errorMessage = 'Login service not found. Please try again later.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (serverMessage) {
          errorMessage = serverMessage;
        }
      } else if (err.request) {
        // Request made but no response received
        errorMessage = 'Network error. Please check your internet connection or try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg2)' }}>
      <div style={{ width:'100%', maxWidth:440, padding:'0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div className="nav-logo-circle" style={{ width:72, height:72, fontSize:34, margin:'0 auto 16px', animation:'glow 2.5s ease-in-out infinite' }}>S</div>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Welcome Back</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Sign in to your AW Alkaline Water account</p>
        </div>

        <div className="card" style={{ border:'1px solid var(--glass-border)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <input className="form-input" type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight:46 }}/>
                <button type="button" onClick={() => setShow(!show)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>
                  {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent:'center', marginTop:8 }}>
              {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }}/> Signing in...</> : <>Sign In <ArrowRight size={16}/></>}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:20, color:'var(--text-muted)', fontSize:14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--primary)', fontWeight:600 }}>Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
