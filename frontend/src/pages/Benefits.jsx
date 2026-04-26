import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, Shield, Droplets, Star, Brain, Bone, Activity, CheckCircle, ArrowRight } from 'lucide-react';

const MAIN_BENEFITS = [
  { icon:<Heart size={36}/>,    color:'#ef4444', title:'Cardiovascular Health',    desc:'Alkaline water helps maintain healthy blood pressure and reduces risk of cardiovascular disease by balancing blood acidity naturally.' },
  { icon:<Brain size={36}/>,    color:'#a855f7', title:'Improved Mental Clarity',  desc:'Better hydration at cellular level means improved oxygen delivery to the brain, leading to sharper focus and mental alertness.' },
  { icon:<Zap size={36}/>,      color:'#f59e0b', title:'Increased Energy Levels',  desc:'Alkaline minerals like calcium, magnesium and potassium boost metabolism and fight fatigue — naturally.' },
  { icon:<Shield size={36}/>,   color:'#22c55e', title:'Detoxification',           desc:'High pH water flushes acidic waste products from cells more efficiently than regular water, promoting full-body detox.' },
  { icon:<Bone size={36}/>,     color:'#00b4d8', title:'Stronger Bones',           desc:'Research shows alkaline water reduces bone loss. The minerals calcium and bicarbonate protect bone density.' },
  { icon:<Activity size={36}/>, color:'#f97316', title:'Better Digestion',         desc:'Neutralises stomach acid, alleviates acid reflux and GERD symptoms. Supports a healthy gut microbiome.' },
  { icon:<Droplets size={36}/>, color:'#60a5fa', title:'Superior Hydration',       desc:'Micro-clustered water molecules are smaller and penetrate cell membranes more efficiently than regular H₂O.' },
  { icon:<Star size={36}/>,     color:'#ffd700', title:'Anti-Ageing Effect',       desc:'Antioxidant-rich negative ORP water neutralises free radicals that damage cells and accelerate ageing.' },
];

const GOV_DATA = [
  { authority: 'WHO', standard: 'Recommended pH: 6.5–8.5', note: 'World Health Organization – Guidelines for Drinking-water Quality, 4th ed.' },
  { authority: 'FSSAI', standard: 'Packaged water pH: 6.5–8.5', note: 'Food Safety and Standards Authority of India – IS 13428:2005' },
  { authority: 'BIS', standard: 'IS 13428 Alkaline water certification', note: 'Bureau of Indian Standards – Packaged Natural Mineral Water' },
  { authority: 'MoHFW', standard: 'Advisable drinking water pH: 7–8.5', note: 'Ministry of Health & Family Welfare, Govt. of India' },
];

export default function Benefits() {
  return (
    <div className="page-wrap">
      {/* Header */}
      <section style={{ background:'linear-gradient(180deg,var(--bg2),var(--bg))', padding:'100px 0 60px', textAlign:'center' }}>
        <div className="container">
          <div className="badge badge-primary" style={{ marginBottom:20, fontSize:13 }}>
            <Droplets size={14}/> Science-Backed Benefits
          </div>
          <h1 className="section-title" style={{ marginBottom:16 }}>Why Alkaline Water?</h1>
          <p className="section-subtitle" style={{ maxWidth:600, margin:'0 auto' }}>
            AW Alkaline Water at <strong style={{color:'var(--gold)'}}>pH 8.5</strong> is backed by science, certified by government authorities,
            and crafted for your optimal health.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-4" style={{ gap:24 }}>
            {MAIN_BENEFITS.map(b => (
              <div key={b.title} className="card" style={{ textAlign:'center' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:`rgba(${b.color.includes('#ef')? '239,68,68' : b.color.includes('#a8')? '168,85,247' : b.color.includes('#f5')? '245,158,11' : b.color.includes('#22')? '34,197,94' : b.color.includes('#00')? '0,180,216' : b.color.includes('#f9')? '249,115,22' : b.color.includes('#60')? '96,165,250' : '255,215,0'},0.12)`, border:`1px solid ${b.color}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:b.color }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>{b.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:13, lineHeight:1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* pH Science */}
      <section className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems:'center', gap:60 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom:20 }}>The pH 8.5 Advantage</h2>
              <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.8, marginBottom:24 }}>
                The pH scale runs from 0 (highly acidic) to 14 (highly alkaline). Pure water is neutral at 7.0.
                Our AW water sits at <strong style={{color:'var(--primary)'}}>8.5 pH</strong> — the sweet spot for maximum health benefits
                without being overly alkaline.
              </p>
              <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.8, marginBottom:24 }}>
                The modern diet — processed food, soft drinks, stress — makes our body acidic. Drinking AW at 8.5 pH
                <strong style={{color:'var(--accent)'}}> restores your body's natural alkaline balance</strong>.
              </p>
              {[
                'Neutralises acid in blood and urine',
                'Reduces lactic acid build-up after exercise',
                'Supports kidney health and prevents kidney stones',
                'Enhances the taste and quality of water',
              ].map(item => (
                <div key={item} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:14 }}>
                  <CheckCircle size={16} color="var(--success)" style={{ flexShrink:0, marginTop:2 }}/>
                  <span style={{ color:'var(--text-muted)', fontSize:14 }}>{item}</span>
                </div>
              ))}
            </div>
            {/* Visual pH bar */}
            <div className="ph-scale-wrap">
              <h3 style={{ marginBottom:24, fontWeight:700, fontSize:18 }}>pH Scale</h3>
              {[
                { label:'Battery Acid', ph:0,  color:'#dc2626' },
                { label:'Soda / Cola',  ph:2.5, color:'#ea580c' },
                { label:'Coffee',       ph:5,   color:'#ca8a04' },
                { label:'Pure Water',   ph:7,   color:'#16a34a' },
                { label:'AW Water ⭐',  ph:8.5, color:'#0077b6', highlight:true },
                { label:'Baking Soda',  ph:9,   color:'#7c3aed' },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <span style={{ width:110, fontSize:12, color: item.highlight ? 'var(--primary)' : 'var(--text-muted)', fontWeight: item.highlight ? 700 : 400 }}>{item.label}</span>
                  <div style={{ flex:1, height:10, borderRadius:5, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                    <div style={{ width:`${(item.ph/14)*100}%`, height:'100%', background:item.color, borderRadius:5, transition:'width 1s' }}/>
                  </div>
                  <span style={{ width:30, fontSize:13, fontWeight:700, color: item.highlight ? 'var(--primary)' : 'var(--text-muted)' }}>{item.ph}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Government Data */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom:48 }}>
            <h2 className="section-title">Government & Authority Backing</h2>
            <p className="section-subtitle">Our 8.5 pH standard is aligned with official government guidelines.</p>
          </div>
          <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Authority</th>
                    <th>Standard / Guideline</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {GOV_DATA.map(row => (
                    <tr key={row.authority}>
                      <td><span className="badge badge-primary">{row.authority}</span></td>
                      <td style={{ fontWeight:600 }}>{row.standard}</td>
                      <td style={{ color:'var(--text-muted)', fontSize:13 }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Link to="/register" className="btn btn-primary">Start Your AW Journey <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
