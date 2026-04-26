import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Gift, Users, Star } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="page-wrap">
      {/* Header */}
      <section style={{ background:'linear-gradient(180deg,var(--bg2),var(--bg))', padding:'100px 0 60px', textAlign:'center' }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom:20 }}>💰 Simple Pricing</div>
          <h1 className="section-title" style={{ marginBottom:16 }}>Affordable Alkaline Health</h1>
          <p className="section-subtitle" style={{ maxWidth:520, margin:'0 auto' }}>
            One bottle, one price — ₹50. Transparent billing every 15 days. No hidden charges.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="section">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap' }}>

            {/* Main bottle price */}
            <div className="card" style={{ maxWidth:340, textAlign:'center', border:'2px solid var(--primary)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, background:'linear-gradient(135deg,var(--primary),var(--primary-dark))', padding:'8px', fontSize:13, fontWeight:700 }}>
                STANDARD PRICE
              </div>
              <div style={{ marginTop:32 }}>
                <div style={{ fontSize:16, color:'var(--text-muted)', marginBottom:8 }}>AW Alkaline Water</div>
                <div style={{ fontSize:72, fontWeight:900, background:'linear-gradient(135deg,#fff,var(--primary))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>₹50</div>
                <div style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>per 1 Litre bottle</div>
                {['pH 8.5 Alkaline Water','BPA-Free Bottle','FSSAI Certified','12-Hr Delivery Included','GST Invoice Provided'].map(f => (
                  <div key={f} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12, textAlign:'left' }}>
                    <CheckCircle size={15} color="var(--success)"/>
                    <span style={{ fontSize:14, color:'var(--text-muted)' }}>{f}</span>
                  </div>
                ))}
                <Link to="/book-water?price=50" className="btn btn-primary w-full" style={{ marginTop:16, justifyContent:'center' }}>
                  Order Now <ArrowRight size={16}/>
                </Link>
              </div>
            </div>

            {/* Registration */}
            <div className="card" style={{ maxWidth:340, textAlign:'center', border:'2px solid var(--gold)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, background:'linear-gradient(135deg,#ffd700,#f59e0b)', padding:'8px', fontSize:13, fontWeight:700, color:'#000' }}>
                ONE-TIME REGISTRATION
              </div>
              <div style={{ marginTop:32 }}>
                <div style={{ fontSize:16, color:'var(--text-muted)', marginBottom:8 }}>Join AW Family</div>
                <div style={{ fontSize:72, fontWeight:900, background:'linear-gradient(135deg,#ffd700,#f59e0b)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }}>₹1500</div>
                <div style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>one-time registration fee</div>
                {['3 FREE Bottles on Joining','2 Bookings Per Person Per Cycle','Your Unique Referral Code','15-Day Billing Cycle','E-Invoice to Your Email'].map(f => (
                  <div key={f} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12, textAlign:'left' }}>
                    <CheckCircle size={15} color="var(--gold)"/>
                    <span style={{ fontSize:14, color:'var(--text-muted)' }}>{f}</span>
                  </div>
                ))}
                <Link to="/book-water" className="btn btn-gold w-full" style={{ marginTop:16, justifyContent:'center' }}>
                  Book Water <ArrowRight size={16}/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom:48 }}>
            <h2 className="section-title">💰 Referral Programme</h2>
            <p className="section-subtitle">Refer 2 friends and earn <strong style={{color:'var(--gold)'}}>25% lifetime discount</strong> on every order.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { step:'01', icon:<Users size={32}/>, title:'Refer a Friend', desc:'Share your unique referral code with friends or family in Vijayawada / Hyderabad.' },
              { step:'02', icon:<Gift size={32}/>,  title:'They Register', desc:'Your friend registers using your code and pays ₹1500. They instantly get 25% discount.' },
              { step:'03', icon:<Star size={32}/>,  title:'You Both Save', desc:'You earn a lifetime 25% discount on every order placed after the referral activates.' },
            ].map(item => (
              <div key={item.step} className="card" style={{ textAlign:'center' }}>
                <div style={{ fontSize:48, fontWeight:900, color:'rgba(0,180,216,0.1)', lineHeight:1, marginBottom:16 }}>{item.step}</div>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(255,215,0,0.1)', border:'1px solid var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', margin:'-28px auto 16px', color:'var(--gold)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:10 }}>{item.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background:'rgba(255,215,0,0.06)', border:'1px solid rgba(255,215,0,0.25)', borderRadius:'var(--radius)', padding:28, marginTop:40, textAlign:'center' }}>
            <h3 style={{ color:'var(--gold)', fontWeight:800, fontSize:20, marginBottom:8 }}>Referral Terms</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:24, justifyContent:'center', marginTop:16 }}>
              {[
                '✅ Refer up to 2 people',
                '✅ 25% discount per referral',
                '✅ Lifetime discount – never expires',
                '✅ Discount applied automatically on every bill',
                '✅ Referral tracked by unique code',
              ].map(t => <span key={t} style={{ fontSize:14, color:'var(--text-muted)' }}>{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Billing cycle */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom:40 }}>
            <h2 className="section-title">Billing Cycle</h2>
            <p className="section-subtitle">Bills are generated automatically every 15 days and sent to your email.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {[
              { day:'Day 1', label:'Register & Get 3 Bottles', color:'var(--success)' },
              { day:'Day 1–15', label:'Place up to 2 Bookings', color:'var(--primary)' },
              { day:'Day 15', label:'Bill Generated + Email Sent', color:'var(--warning)' },
              { day:'Day 22', label:'Pay via UPI / Card / Net Banking', color:'var(--gold)' },
            ].map(item => (
              <div key={item.day} className="card" style={{ textAlign:'center', borderColor: item.color + '40' }}>
                <div style={{ fontSize:28, fontWeight:900, color:item.color, marginBottom:8 }}>{item.day}</div>
                <div style={{ color:'var(--text-muted)', fontSize:14 }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Link to="/book-water" className="btn btn-primary">Start Today <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
