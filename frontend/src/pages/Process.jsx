import React, { useState } from 'react';
import { Droplets, ChevronRight, Play, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    num: 1,
    icon: '🌊',
    title: 'Raw Water Collection',
    desc: 'High-quality underground water is sourced from certified borewells in Vijayawada and Hyderabad. Water is tested at source for TDS, pH, and microbial content.',
    details: ['TDS < 500 ppm tested', 'Microbial free at source', 'Certified borewell labs'],
  },
  {
    num: 2,
    icon: '🔬',
    title: 'Multi-Stage Filtration',
    desc: 'Water passes through a 7-stage filtration system — Sediment filter → Carbon filter → Softener → Ultra Filtration → Reverse Osmosis → UV Sterilisation → Micro filter.',
    details: ['Removes 99.9% bacteria', 'Removes heavy metals', 'RO + UV + UF triple purification'],
  },
  {
    num: 3,
    icon: '⚗️',
    title: 'Alkaline Mineralisation',
    desc: 'Purified water flows through our patented alkaline mineral cartridge infused with calcium, magnesium, potassium. This raises the pH from neutral 7 to our target 8.5.',
    details: ['Calcium & Magnesium added', 'Ionised via electrolysis', 'Consistent pH 8.5 output'],
  },
  {
    num: 4,
    icon: '🧪',
    title: 'pH & ORP Testing',
    desc: 'Every batch is tested for pH (target 8.5) and Oxidation Reduction Potential (negative ORP = antioxidant). Only water that passes goes to bottling.',
    details: ['pH: 8.5 ± 0.2', 'ORP: –200 to –350 mV', 'Batch report logged'],
  },
  {
    num: 5,
    icon: '🏭',
    title: 'Bottling & Sealing',
    desc: 'Water is bottled in food-grade BPA-free bottles in a dust-free clean room under automated machinery. Tamper-evident caps seal every bottle.',
    details: ['BPA-Free PET bottles', 'Automated clean-room fill', 'Tamper-evident seal'],
  },
  {
    num: 6,
    icon: '🏷️',
    title: 'Quality Labelling',
    desc: 'Each bottle is labelled with batch number, pH value, production date, expiry, FSSAI license, and BIS certification mark.',
    details: ['FSSAI license printed', 'BIS mark certified', 'QR code for batch trace'],
  },
  {
    num: 7,
    icon: '🚚',
    title: 'Supply & Delivery',
    desc: 'Bottles are dispatched from our plant to customers within 12 hours of order placement. Our cold-chain logistic network covers all of Vijayawada & Hyderabad.',
    details: ['12-hour guaranteed delivery', 'Cold-chain maintained', 'GPS tracked vehicles'],
  },
];

export default function Process() {
  const [active, setActive] = useState(0);

  return (
    <div className="page-wrap">
      {/* Header */}
      <section style={{ background:'linear-gradient(180deg,var(--bg2),var(--bg))', padding:'100px 0 60px', textAlign:'center' }}>
        <div className="container">
          <div className="badge badge-primary" style={{ marginBottom:20 }}>
            <Droplets size={14}/> Production Process
          </div>
          <h1 className="section-title" style={{ marginBottom:16 }}>From Source to Your Sip</h1>
          <p className="section-subtitle" style={{ maxWidth:560, margin:'0 auto' }}>
            Every drop of AW Alkaline Water goes through a rigorous 7-step purification and alkalisation process
            before it reaches your hands.
          </p>
        </div>
      </section>

      {/* Interactive Process */}
      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:40, alignItems:'start' }}>
            {/* Step list */}
            <div style={{ position:'sticky', top:90 }}>
              {STEPS.map((step, i) => (
                <button key={step.num} onClick={() => setActive(i)} style={{
                  width:'100%', display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                  borderRadius:'var(--radius)', marginBottom:8, border:'1px solid',
                  borderColor: active===i ? 'var(--primary)' : 'var(--glass-border)',
                  background: active===i ? 'rgba(0,180,216,0.1)' : 'var(--glass)',
                  cursor:'pointer', transition:'all 0.3s', textAlign:'left',
                }}>
                  <span style={{ fontSize:24 }}>{step.icon}</span>
                  <div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.5 }}>Step {step.num}</div>
                    <div style={{ fontSize:14, fontWeight:600, color: active===i ? 'var(--primary)' : 'var(--text)' }}>{step.title}</div>
                  </div>
                  {active===i && <ChevronRight size={16} color="var(--primary)" style={{ marginLeft:'auto', flexShrink:0 }}/>}
                </button>
              ))}
            </div>

            {/* Step detail */}
            <div className="card" style={{ minHeight:320 }}>
              <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28 }}>
                <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(0,180,216,0.12)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>
                  {STEPS[active].icon}
                </div>
                <div>
                  <div style={{ color:'var(--text-muted)', fontSize:13, marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>Step {STEPS[active].num} of 7</div>
                  <h2 style={{ fontSize:26, fontWeight:800 }}>{STEPS[active].title}</h2>
                </div>
              </div>

              <p style={{ color:'var(--text-muted)', fontSize:16, lineHeight:1.8, marginBottom:28 }}>
                {STEPS[active].desc}
              </p>

              <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
                {STEPS[active].details.map(d => (
                  <div key={d} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(0,180,216,0.08)', border:'1px solid rgba(0,180,216,0.2)', borderRadius:8, padding:'8px 16px' }}>
                    <CheckCircle size={14} color="var(--success)"/>
                    <span style={{ fontSize:13, color:'var(--text)' }}>{d}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop:32 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>
                  <span>Process Progress</span>
                  <span>{Math.round(((active+1)/STEPS.length)*100)}%</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.06)' }}>
                  <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(to right, var(--primary), var(--accent))', width:`${((active+1)/STEPS.length)*100}%`, transition:'width 0.5s ease' }}/>
                </div>
              </div>

              <div style={{ display:'flex', gap:12, marginTop:28 }}>
                {active > 0 && (
                  <button className="btn btn-outline btn-sm" onClick={() => setActive(a => a-1)}>← Previous</button>
                )}
                {active < STEPS.length-1 && (
                  <button className="btn btn-primary btn-sm" onClick={() => setActive(a => a+1)}>Next Step →</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <h2 className="section-title text-center" style={{ marginBottom:48 }}>Water Flow Diagram</h2>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:0 }}>
            {STEPS.map((step, i) => (
              <React.Fragment key={step.num}>
                <div style={{ textAlign:'center', padding:'16px 12px' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background: i===2 ? 'linear-gradient(135deg,var(--primary),var(--primary-dark))' : 'var(--glass)', border:'2px solid', borderColor: i===2 ? 'var(--primary)' : 'var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 10px', boxShadow: i===2 ? '0 0 20px rgba(0,180,216,0.5)' : 'none' }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', maxWidth:80 }}>{step.title}</div>
                </div>
                {i < STEPS.length-1 && (
                  <div style={{ color:'var(--primary)', fontSize:20, margin:'0 -4px' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
