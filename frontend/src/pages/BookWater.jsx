import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Crosshair, ArrowRight, CheckCircle, CreditCard, Lock, Smartphone, QrCode, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookWater() {
  const [params] = useSearchParams();
  const priceParam = params.get('price');
  const amount = priceParam === '50' ? '50' : '1,500';
  const amountValue = priceParam === '50' ? 50 : 1500;
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '',
    houseNumber: '', streetName: '', city: 'Vijayawada', state: 'Andhra Pradesh', landmark: '', pincode: '',
    referralCode: ''
  });
  
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 2) {
      toast.error('Payment timeout! Please try again.');
      setStep(1);
      setTimeLeft(180);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const getCurrentLocation = () => {
    setLoadingLoc(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLoadingLoc(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        toast.success('Location fetched successfully!');
        setLoadingLoc(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        setLoadingLoc(false);
      }
    );
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setStep(2);
    setTimeLeft(180); // Reset timer when proceeding to payment
  };

  const handlePayment = async (e) => {
    e?.preventDefault();
    setLoading(true);
    // Simulate payment API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      toast.success('Payment successful! Water booked.');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (success) {
    return (
      <div className="page-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg2)', padding:'80px 24px 40px' }}>
        <div className="card" style={{ maxWidth: 460, textAlign: 'center', width: '100%' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,197,94,0.1)', color:'var(--success)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <CheckCircle size={36}/>
          </div>
          <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Booking & Payment Confirmed!</h2>
          <p style={{ color:'var(--text-muted)', marginBottom:24 }}>Your water bottle delivery has been scheduled and payment of ₹{amount} was received.</p>
          <button className="btn btn-primary w-full" onClick={() => window.location.reload()} style={{ justifyContent:'center' }}>Book Another <ArrowRight size={16}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg2)', padding:'80px 24px 40px' }}>
      <div style={{ width:'100%', maxWidth:600 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div className="nav-logo-circle" style={{ width:72, height:72, fontSize:34, margin:'0 auto 16px' }}>💧</div>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Book Water Delivery</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Get fresh alkaline water delivered to your doorstep</p>
        </div>

        <div className="card">
          {step === 1 ? (
            <form onSubmit={handleProceedToPayment}>
              <div className="grid-2" style={{ gap:16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required/>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--glass-border)', margin: '24px 0' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={18}/> Delivery Address</h3>

              <div className="grid-2" style={{ gap:16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">House Number *</label>
                  <input className="form-input" placeholder="Flat / House No." value={form.houseNumber} onChange={e => setForm({...form, houseNumber: e.target.value})} required/>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Street Name *</label>
                  <input className="form-input" placeholder="Street Name" value={form.streetName} onChange={e => setForm({...form, streetName: e.target.value})} required/>
                </div>
              </div>

              <div className="grid-2" style={{ gap:16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">City *</label>
                  <input className="form-input" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required/>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">State *</label>
                  <input className="form-input" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} required/>
                </div>
              </div>

              <div className="grid-2" style={{ gap:16, marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Landmark *</label>
                  <input className="form-input" placeholder="Near XYZ" value={form.landmark} onChange={e => setForm({...form, landmark: e.target.value})} required/>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Pincode *</label>
                  <input className="form-input" placeholder="500032" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} required/>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <button type="button" onClick={getCurrentLocation} className="btn btn-outline w-full" style={{ justifyContent: 'center', gap: 8 }}>
                  {loadingLoc ? <div className="spinner" style={{ width:16, height:16 }}/> : <Crosshair size={16}/>}
                  {location ? 'Location Captured ✓' : 'Get Current GPS Location'}
                </button>
                
                {location && (
                  <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <iframe 
                      width="100%" 
                      height="200" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01}%2C${location.lat-0.01}%2C${location.lng+0.01}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
                      style={{ display: 'block' }}
                    ></iframe>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px dashed var(--glass-border)', margin: '24px 0' }} />

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Referral Code *</label>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Enter the referral code of the person who introduced you. They get a percentage discount!</p>
                <input className="form-input" placeholder="AW-XXXXXX" value={form.referralCode} onChange={e => setForm({...form, referralCode: e.target.value})} required/>
              </div>

              {/* Fee notice */}
              <div style={{ background:'rgba(255,215,0,0.06)', border:'1px solid rgba(255,215,0,0.2)', borderRadius:10, padding:14, marginBottom:20, textAlign:'center' }}>
                <div style={{ color:'var(--gold)', fontWeight:700, fontSize:18 }}>Booking Amount: ₹{amount}</div>
                <div style={{ color:'var(--text-muted)', fontSize:13, marginTop:4 }}>
                  {priceParam === '50' ? 'Standard 1 Litre bottle price.' : 'One-time fee. Includes 3 FREE bottles on booking.'}
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit" style={{ justifyContent:'center' }}>
                Continue to Payment <ArrowRight size={16}/>
              </button>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text)' }}>Complete Payment</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '6px 12px', borderRadius: 50, fontSize: 14, fontWeight: 600 }}>
                  <Clock size={16}/> {formatTime(timeLeft)}
                </div>
              </div>

              {/* Payment Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg1)', padding: 6, borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <button type="button" onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: paymentMethod === 'card' ? 'var(--primary)' : 'transparent', color: paymentMethod === 'card' ? '#fff' : 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, transition: '0.2s' }}>
                  <CreditCard size={18}/> Card
                </button>
                <button type="button" onClick={() => setPaymentMethod('upi')} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: paymentMethod === 'upi' ? 'var(--primary)' : 'transparent', color: paymentMethod === 'upi' ? '#fff' : 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, transition: '0.2s' }}>
                  <Smartphone size={18}/> UPI
                </button>
                <button type="button" onClick={() => setPaymentMethod('scanner')} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: paymentMethod === 'scanner' ? 'var(--primary)' : 'transparent', color: paymentMethod === 'scanner' ? '#fff' : 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, transition: '0.2s' }}>
                  <QrCode size={18}/> Scan QR
                </button>
              </div>

              <form onSubmit={handlePayment}>
                {paymentMethod === 'card' && (
                  <div style={{ animation: 'fade-in 0.3s ease' }}>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input className="form-input" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} required/>
                    </div>
                    <div className="grid-2" style={{ gap:16, marginBottom:24 }}>
                      <div className="form-group" style={{ marginBottom:0 }}>
                        <label className="form-label">Expiry Date</label>
                        <input className="form-input" placeholder="MM/YY" maxLength={5} required/>
                      </div>
                      <div className="form-group" style={{ marginBottom:0 }}>
                        <label className="form-label">CVV</label>
                        <input className="form-input" placeholder="XXX" type="password" maxLength={3} required/>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div style={{ animation: 'fade-in 0.3s ease', marginBottom: 24 }}>
                    <div className="form-group">
                      <label className="form-label">UPI ID</label>
                      <input className="form-input" placeholder="username@upi" required/>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>You will receive a payment request on your UPI app.</p>
                  </div>
                )}

                {paymentMethod === 'scanner' && (
                  <div style={{ animation: 'fade-in 0.3s ease', textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block', marginBottom: 16 }}>
                      {/* Fake QR Code */}
                      <div style={{ width: 160, height: 160, background: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 10px, #fff 20px)', border: '8px solid #000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#fff', padding: 8, fontWeight: 800, color: '#000' }}>₹{amount}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text)' }}>Scan with any UPI App to pay</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Amount: <strong style={{ color: 'var(--primary)' }}>₹{amount}</strong></p>
                  </div>
                )}

                <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent:'center' }}>
                  {loading ? <><div className="spinner" style={{ width:18, height:18, borderWidth:2 }}/> Processing Payment...</> : <><Lock size={16}/> Pay ₹{amount} Now</>}
                </button>
              </form>
              
              <button type="button" onClick={() => { setStep(1); setTimeLeft(180); }} className="btn btn-outline w-full" style={{ justifyContent:'center', marginTop:12, background:'transparent', border:'none', color:'var(--text-muted)' }}>
                Cancel & Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
