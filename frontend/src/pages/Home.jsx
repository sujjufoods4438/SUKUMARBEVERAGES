import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Shield, Zap, Heart, Star, ArrowRight, CheckCircle, Award, Truck, Users } from 'lucide-react';

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 30 + 10,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  duration: Math.random() * 3 + 2,
}));

const STATS = [
  { value: '8.5', label: 'pH Level', suffix: '' },
  { value: '50', label: 'Per Bottle', suffix: '₹' },
  { value: '12', label: 'Hr Delivery', suffix: '' },
  { value: '25', label: 'Referral Disc.', suffix: '%' },
];

const BENEFITS = [
  { icon: <Heart size={28}/>, title: 'Boosts Immunity', desc: 'Alkaline water neutralises free radicals and strengthens your immune system daily.' },
  { icon: <Zap size={28}/>, title: 'More Energy', desc: 'Higher pH helps your body absorb nutrients faster — feel energised all day long.' },
  { icon: <Shield size={28}/>, title: 'pH 8.5 Certified', desc: 'Govt-verified 8.5 pH level ensures safe alkaline hydration as per FSSAI norms.' },
  { icon: <Droplets size={28}/>, title: 'Better Hydration', desc: 'Micro-clustered molecules penetrate cells faster than regular water.' },
  { icon: <Star size={28}/>, title: 'Anti-Oxidant', desc: 'Negative ORP water fights oxidative stress and slows cellular ageing.' },
  { icon: <Award size={28}/>, title: 'Govt. Approved', desc: 'Produced under FSSAI & BIS guidelines so every sip is safe and pure.' },
];

export default function Home() {
  return (
    <div className="page-wrap">

      {/* ── Hero ── */}
      <section className="water-bg" style={{ position:'relative', overflow:'hidden', minHeight:'100vh', display:'flex', alignItems:'center' }}>
        {/* Animated bubbles */}
        {BUBBLES.map(b => (
          <span key={b.id} className="bubble" style={{
            width: b.size, height: b.size,
            left: `${b.left}%`, bottom: 0,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}/>
        ))}

        <div className="container" style={{ position:'relative', zIndex:2, padding:'100px 24px 60px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div className="fade-up">
              <div className="badge badge-primary" style={{ marginBottom:20, fontSize:13 }}>
                <Droplets size={14}/> Premium Alkaline Water
              </div>
              <h1 style={{ fontSize:'clamp(36px,6vw,64px)', fontWeight:900, lineHeight:1.1, marginBottom:20 }}>
                Drink Smarter.<br/>
                <span style={{ background:'linear-gradient(135deg,#00b4d8,#90e0ef)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Live Healthier.
                </span>
              </h1>
              <p style={{ fontSize:18, color:'var(--text-muted)', lineHeight:1.8, marginBottom:32, maxWidth:480 }}>
                Introducing <strong style={{color:'var(--primary)'}}>AW Alkaline Water 2.0</strong> — Government-approved 8.5 pH water
                by Sukumar Industries. Pure water, purified purpose.
              </p>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                <Link to="/book-water" className="btn btn-primary">
                  Book Water – ₹1500 <ArrowRight size={18}/>
                </Link>
                <Link to="/benefits" className="btn btn-outline">
                  Learn Benefits
                </Link>
              </div>
              <div style={{ display:'flex', gap:24, marginTop:36, flexWrap:'wrap' }}>
                {[['✅','pH 8.5'], ['🏛️','Govt Approved'], ['🚚','12-Hr Delivery']].map(([icon, text]) => (
                  <span key={text} style={{ fontSize:13, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6 }}>
                    {icon} {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Video Visual */}
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
              <div className="float" style={{ position:'relative', width: '100%', maxWidth: '360px' }}>
                <div style={{
                  borderRadius: '30px',
                  overflow: 'hidden',
                  border: '3px solid rgba(144,224,239,0.5)',
                  boxShadow: '0 0 60px rgba(0,180,216,0.4)',
                  position: 'relative',
                  background: '#000'
                }}>
                  <video src="/v2.mp4" autoPlay muted loop playsInline style={{ width:'100%', display:'block', objectFit:'cover' }}></video>
                </div>
                {/* Glow ring */}
                <div style={{
                  position:'absolute', inset:-20,
                  borderRadius:'50%',
                  background:'radial-gradient(circle, rgba(0,180,216,0.2) 0%, transparent 70%)',
                  animation:'ripple 2s ease-in-out infinite',
                  zIndex: -1
                }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Sukumar Multi-Layer Wave Animation */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:150, overflow:'hidden', zIndex:1, pointerEvents:'none' }}>
          <div className="sukumar-waves">
            <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
              </defs>
              <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0,180,216,0.2)" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(0,180,216,0.4)" />
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(0,180,216,0.1)" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#020e1a" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background:'var(--bg)', padding:'60px 0' }}>
        <div className="container">
          <div className="grid-4">
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.suffix}{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Videos ── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom:40 }}>
            <h2 className="section-title">See AW Alkaline Water in Action</h2>
            <p className="section-subtitle">Watch our premium water quality and production process.</p>
          </div>
          <div className="grid-2" style={{ gap:32 }}>
            <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid var(--glass-border)', boxShadow:'0 10px 30px rgba(0,0,0,0.2)', background:'#000' }}>
              <video src="/v1.mp4" controls autoPlay muted loop playsInline style={{ width:'100%', display:'block' }}></video>
            </div>
            <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid var(--glass-border)', boxShadow:'0 10px 30px rgba(0,0,0,0.2)', background:'#000' }}>
              <video src="/v2.mp4" controls autoPlay muted loop playsInline style={{ width:'100%', display:'block' }}></video>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits Preview ── */}
      <section className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom:52 }}>
            <h2 className="section-title">Why Choose AW Alkaline Water?</h2>
            <p className="section-subtitle">Science-backed benefits that transform your daily hydration.</p>
          </div>
          <div className="grid-3">
            {BENEFITS.map(b => (
              <div key={b.title} className="card" style={{ textAlign:'center' }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(0,180,216,0.12)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:'var(--primary)' }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10 }}>{b.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Link to="/benefits" className="btn btn-primary">Explore All Benefits <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* ── pH Info ── */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems:'center', gap:60 }}>
            <div>
              <h2 className="section-title">Government-Backed pH 8.5 Standard</h2>
              <p className="section-subtitle" style={{ marginBottom:24 }}>
                The Indian Government recommends a drinking water pH of <strong style={{color:'var(--primary)'}}>7 to 8.5</strong>.
                Our AW Alkaline Water sits exactly at <strong style={{color:'var(--gold)'}}>8.5 pH</strong> — the optimum healthy level.
              </p>
              {[
                'WHO recommends pH 6.5–8.5 for drinking water',
                'FSSAI standards allow up to 8.5 pH in packaged water',
                'BIS (IS 13428) certification for alkaline packaged water',
                'Our water is tested every batch for consistent 8.5 pH',
              ].map(item => (
                <div key={item} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
                  <CheckCircle size={18} color="var(--success)" style={{ flexShrink:0, marginTop:2 }}/>
                  <span style={{ color:'var(--text-muted)', fontSize:15 }}>{item}</span>
                </div>
              ))}
              <Link to="/benefits" className="btn btn-gold" style={{ marginTop:24 }}>
                Learn the Science
              </Link>
            </div>
            <div className="ph-scale-wrap">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:13, color:'var(--text-muted)' }}>
                <span>0 Acidic</span><span>7 Neutral</span><span>14 Alkaline</span>
              </div>
              <div className="ph-meter">
                <div className="ph-marker" style={{ left:'60.7%' }}/>
              </div>
              <div style={{ textAlign:'center', marginTop:28 }}>
                <div className="ph-number">8.5</div>
                <p style={{ color:'var(--text-muted)', fontSize:14, marginTop:8 }}>Our Certified pH Level</p>
                <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:16, flexWrap:'wrap' }}>
                  <span className="badge badge-success">WHO Approved</span>
                  <span className="badge badge-primary">FSSAI Certified</span>
                  <span className="badge badge-gold">BIS Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCM Strip ── */}
      <section style={{ background:'linear-gradient(135deg,#041524,#062035)', padding:'60px 0', borderTop:'1px solid var(--glass-border)', borderBottom:'1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:32 }}>
            {[
              { icon:<Truck size={32}/>,  title:'12-Hour Delivery',   desc:'Order now, receive today' },
              { icon:<Users size={32}/>,  title:'25% Referral Disc.', desc:'Invite 2 friends, save forever' },
              { icon:<Award size={32}/>,  title:'₹50 Per Bottle',     desc:'Affordable alkaline hydration' },
              { icon:<Shield size={32}/>, title:'GST Invoicing',      desc:'E-invoice sent to your email' },
            ].map(item => (
              <div key={item.title} style={{ textAlign:'center', minWidth:180 }}>
                <div style={{ color:'var(--primary)', marginBottom:12 }}>{item.icon}</div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{item.title}</div>
                <div style={{ color:'var(--text-muted)', fontSize:13 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section water-bg" style={{ textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <h2 className="section-title" style={{ marginBottom:16 }}>Ready to Switch to Alkaline?</h2>
          <p className="section-subtitle" style={{ maxWidth:540, margin:'0 auto 36px' }}>
            Join thousands of healthy customers in Vijayawada & Hyderabad. Register for just ₹1500 and get 3 FREE bottles today.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/book-water" className="btn btn-primary" style={{ fontSize:17, padding:'14px 36px' }}>
              Book Water – ₹1500 <ArrowRight size={18}/>
            </Link>
            <Link to="/process" className="btn btn-outline">Watch How It's Made</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
