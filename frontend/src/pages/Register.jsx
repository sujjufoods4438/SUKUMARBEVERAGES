import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { register, sendOtp, API } = useAuth();
  const navigate = useNavigate();
  const [params]  = useSearchParams();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refValid, setRefValid] = useState(null);

  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    city: 'Vijayawada', street: '', pincode: '',
    referralCode: params.get('ref') || '',
    emailOtp: '', phoneOtp: ''
  });

  // Validate referral code on change
  useEffect(() => {
    if (!form.referralCode) return setRefValid(null);
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API}/referral/validate/${form.referralCode}`);
        setRefValid(data);
      } catch {
        setRefValid({ valid: false });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form.referralCode]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (form.password.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(form.password)) {
      return toast.error('Weak password! Must be 8+ chars with at least 1 letter and 1 number');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    setLoading(true);
    try {
      await sendOtp(form.email, form.phone, form.name);
      toast.success('OTPs sent to your Email and Phone!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTPs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      setSuccessData(user);
      toast.success(`Registration complete!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="page-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg2)', padding:'80px 24px 40px' }}>
        <div className="card" style={{ maxWidth: 460, textAlign: 'center', width: '100%' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,197,94,0.1)', color:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <CheckCircle size={36}/>
          </div>
          <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Registration Complete!</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:24 }}>You've successfully secured your account and 3 FREE bottles.</p>
          
          <div style={{ background:'rgba(255,215,0,0.1)', border:'1px dashed var(--gold)', borderRadius:8, padding:'20px', marginBottom:24 }}>
            <p style={{ fontSize:13, color:'var(--text-muted)', textTransform:'uppercase', fontWeight:600 }}>Your Referral Code</p>
            <h1 style={{ fontSize:32, color:'var(--gold)', letterSpacing:3, margin:'8px 0' }}>{successData.referralCode}</h1>
          </div>
          
          <Link to="/login" className="btn btn-primary w-full" style={{ justifyContent:'center' }}>Log In to Your Account <ArrowRight size={16}/></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg2)', padding:'80px 24px 40px' }}>
      <div style={{ width:'100%', maxWidth:520 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div className="nav-logo-circle" style={{ width:72, height:72, fontSize:34, margin:'0 auto 16px' }}>S</div>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Join AW Family</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Register to secure your account and 3 FREE bottles</p>
        </div>

        {/* Benefits reminder */}
        <div style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, padding:16, marginBottom:24, display:'flex', flexWrap:'wrap', gap:12 }}>
          {['3 FREE Bottles', '₹50/bottle', '12-Hr Delivery', 'Referral Discount'].map(b => (
            <span key={b} style={{ display:'flex', gap:6, alignItems:'center', fontSize:13, color:'var(--success)' }}>
              <CheckCircle size={13}/> {b}
            </span>
          ))}
        </div>

        <div className="card">
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="grid-2" style={{ gap:16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Your name" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} required/>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Phone *</label>
                  <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})} required/>
                </div>
              </div>

              <div className="form-group" style={{ marginTop:16 }}>
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required/>
              </div>

              <div className="grid-2" style={{ gap:16, marginTop:16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Password *</label>
                  <div style={{ position:'relative' }}>
                    <input className="form-input" type={show ? 'text' : 'password'} placeholder="8+ chars, 1 number" value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight:46 }}/>
                    <button type="button" onClick={() => setShow(!show)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)' }}>
                      {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Confirm Password *</label>
                  <input className="form-input" type="password" placeholder="Retype password" value={form.confirmPassword}
                      onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">City * (Service Areas Only)</label>
                <select className="form-select" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div className="grid-2" style={{ gap:16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" placeholder="House/Street" value={form.street}
                    onChange={e => setForm({...form, street: e.target.value})} required/>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Pincode *</label>
                  <input className="form-input" placeholder="500032" value={form.pincode}
                    onChange={e => setForm({...form, pincode: e.target.value})} required/>
                </div>
              </div>

              <div className="form-group" style={{ marginTop:16 }}>
                <label className="form-label">Referral Code (Optional)</label>
                <input className="form-input" placeholder="AW-XXXXXX" value={form.referralCode}
                  onChange={e => setForm({...form, referralCode: e.target.value.toUpperCase()})}
                  style={{ borderColor: refValid ? (refValid.valid ? 'var(--success)' : 'var(--danger)') : 'var(--glass-border)' }}/>
                {refValid?.valid && (
                  <p style={{ color:'var(--success)', fontSize:12, marginTop:6 }}>
                    ✅ Valid code from {refValid.referrerName} — you'll get 25% lifetime discount!
                  </p>
                )}
                {refValid && !refValid.valid && (
                  <p style={{ color:'var(--danger)', fontSize:12, marginTop:6 }}>❌ Invalid referral code</p>
                )}
              </div>



              <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent:'center' }}>
                {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }}/> Requesting OTPs...</> : <>Continue & Verify OTPs <ArrowRight size={16}/></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ background:'rgba(0,180,216,0.08)', borderRadius:10, padding:20, marginBottom:24, textAlign:'center' }}>
                <h3 style={{ fontSize:18, fontWeight:700, color:'var(--primary)', marginBottom:8 }}>Enter Verification Codes</h3>
                <p style={{ fontSize:13, color:'var(--text-muted)' }}>We sent a 6-digit OTP to your Email and Phone.</p>
                <p style={{ fontSize:11, color:'var(--warning)', marginTop:8 }}>(Since this is a demo, check the backend console for the OTP!)</p>
              </div>

              <div className="form-group">
                <label className="form-label">Email OTP *</label>
                <input className="form-input" placeholder="Enter 6-digit Email OTP" value={form.emailOtp}
                  onChange={e => setForm({...form, emailOtp: e.target.value})} required maxLength={6} pattern="[0-9]{6}"/>
              </div>

              <div className="form-group">
                <label className="form-label">Phone OTP *</label>
                <input className="form-input" placeholder="Enter 6-digit Phone OTP (SMS)" value={form.phoneOtp}
                  onChange={e => setForm({...form, phoneOtp: e.target.value})} required maxLength={6} pattern="[0-9]{6}"/>
              </div>

              <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent:'center', marginTop:16 }}>
                {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }}/> Registering...</> : <>Verify & Complete Registration <ArrowRight size={16}/></>}
              </button>

              <button type="button" onClick={() => setStep(1)} className="btn btn-outline w-full" style={{ justifyContent:'center', marginTop:12, background:'transparent', border:'none', color:'var(--text-muted)' }}>
                Go Back
              </button>
            </form>
          )}
          <p style={{ textAlign:'center', marginTop:20, color:'var(--text-muted)', fontSize:14 }}>
            Already registered? <Link to="/login" style={{ color:'var(--primary)', fontWeight:600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
