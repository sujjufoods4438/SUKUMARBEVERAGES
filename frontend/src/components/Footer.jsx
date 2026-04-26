import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, MapPin, Phone, Mail, Globe, Send, Share2, CheckCircle } from 'lucide-react';

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
      e.target.reset();
    }
  };

  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Social */}
          <div>
            <div className="nav-logo" style={{ marginBottom: 16 }}>
              <div className="nav-logo-circle">S</div>
              <div className="footer-brand-name"><span>AW</span> Alkaline Water</div>
            </div>
            <p className="footer-desc">
              Premium 8.5 pH Alkaline Water by Sukumar Industries.<br/>
              Government-approved standards. Pure. Natural. Alkaline.
            </p>
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              {[
                { icon: Globe,  url: '#' },
                { icon: Send,   url: '#' },
                { icon: Share2, url: '#' },
              ].map((social, i) => (
                <a key={i} href={social.url} style={{ width:40, height:40, borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', transition:'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='var(--glass)'; e.currentTarget.style.color='var(--primary)'; }}>
                  <social.icon size={18}/>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer-title">Quick Links</p>
            <div className="footer-links">
              {[
                ['/', 'Home'],
                ['/benefits', 'Benefits'],
                ['/process', 'Process'],
                ['/pricing', 'Pricing'],
                ['/locations', 'Locations'],
                ['/register', 'Register ₹1500']
              ].map(([to, label]) => (
                <Link key={to} to={to} className="footer-link" style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:4, height:4, borderRadius:'50%', background:'var(--primary)' }}/> {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="footer-title">Stay Updated</p>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16 }}>Subscribe to get health tips and offers.</p>
            <form onSubmit={handleSubscribe} style={{ display:'flex', gap:8, background:'var(--glass)', padding:6, borderRadius:12, border:'1px solid var(--glass-border)' }}>
              <input 
                name="email"
                type="email" 
                placeholder="Your email" 
                required
                style={{ background:'transparent', border:'none', color:'#fff', fontSize:13, padding:'8px 12px', outline:'none', flex:1, width:'100%' }}
              />
              <button type="submit" style={{ background:'var(--primary)', border:'none', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer' }}>
                <Send size={16}/>
              </button>
            </form>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:16, color:'var(--success)', fontSize:11 }}>
              <CheckCircle size={12}/> 100% Secure & Spam Free
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-title">Contact Us</p>
            <div className="footer-links">
              <a href="https://maps.google.com/?q=Vijayawada" target="_blank" rel="noreferrer" className="footer-link" style={{ display:'flex', gap:8, alignItems:'center' }}><MapPin size={14} color="var(--primary)"/>Vijayawada, AP (Head Office)</a>
              <a href="https://maps.google.com/?q=Hyderabad" target="_blank" rel="noreferrer" className="footer-link" style={{ display:'flex', gap:8, alignItems:'center' }}><MapPin size={14} color="var(--primary)"/>Hyderabad, TS (Branch Office)</a>
              <a href="tel:+9118001234567" className="footer-link" style={{ display:'flex', gap:8, alignItems:'center' }}><Phone size={14} color="var(--primary)"/>1800-123-4567</a>
              <a href="mailto:info@sukumaraw.com" className="footer-link" style={{ display:'flex', gap:8, alignItems:'center' }}><Mail size={14} color="var(--primary)"/>info@sukumaraw.com</a>
            </div>
            <div style={{ marginTop:20, display:'flex', gap:8 }}>
              <span className="badge badge-success" style={{ fontSize:10 }}>pH 8.5 Certified</span>
              <span className="badge badge-primary" style={{ fontSize:10 }}>Govt Approved</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024 Sukumar Industries – AW Alkaline Water. All rights reserved.</span>
          <span style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Droplets size={14} color="var(--primary)"/> Delivering Pure Health
          </span>
        </div>
      </div>
    </footer>
  );
}
