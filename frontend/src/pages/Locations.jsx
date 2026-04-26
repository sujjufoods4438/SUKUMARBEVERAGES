import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Building, ArrowRight } from 'lucide-react';

const OFFICES = [
  {
    type: 'Head Office',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    address: 'Plot No. 41-10-19, Kolla Vari Street, Krishna Lanka, Vijayawada',
    phone: '+91 9618199598',
    email: 'sukumarindustries@gmail.com',
    hours: 'Mon–Sat: 8:00 AM – 8:00 PM',
    icon: '🏛️',
    mapUrl: 'https://maps.google.com/?q=16.504830,80.626425',
    color: 'var(--primary)',
  },
  {
    type: 'Branch Office',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Unit 7, Techno Park, Gachibowli, Hyderabad – 500032, Telangana',
    phone: '+91 98490 XXXXX',
    email: 'hyd@sukumaraw.com',
    hours: 'Mon–Sat: 8:00 AM – 8:00 PM',
    icon: '🏢',
    mapUrl: 'https://maps.google.com?q=Hyderabad+Telangana',
    color: '#a855f7',
  },
];

const SERVICE_AREAS = {
  'Vijayawada': [
    'Benz Circle', 'Governorpet', 'Labbipet', 'Suryaraopet',
    'Auto Nagar', 'Kanuru', 'Gunadala', 'Patamata',
    'Moghalrajpuram', 'Krishnalanka', 'Vinayakpuram',
  ],
  'Hyderabad': [
    'Gachibowli', 'Hitech City', 'Kondapur', 'Madhapur',
    'Banjara Hills', 'Jubilee Hills', 'Ameerpet', 'Kukatpally',
    'Secunderabad', 'Dilsukhnagar', 'LB Nagar',
  ],
};

export default function Locations() {
  return (
    <div className="page-wrap">
      {/* Header */}
      <section style={{ background:'linear-gradient(180deg,var(--bg2),var(--bg))', padding:'100px 0 60px', textAlign:'center' }}>
        <div className="container">
          <div className="badge badge-primary" style={{ marginBottom:20 }}>
            <MapPin size={14}/> Service Locations
          </div>
          <h1 className="section-title" style={{ marginBottom:16 }}>We're in Your City</h1>
          <p className="section-subtitle" style={{ maxWidth:540, margin:'0 auto' }}>
            AW Alkaline Water delivers to all major areas across Vijayawada and Hyderabad
            within <strong style={{color:'var(--primary)'}}>12 hours</strong> of your order.
          </p>
        </div>
      </section>

      {/* Office Cards */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap:32 }}>
            {OFFICES.map(office => (
              <div key={office.city} className="card" style={{ borderColor: office.color + '40' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                  <span style={{ fontSize:40 }}>{office.icon}</span>
                  <div>
                    <span className="badge" style={{ background:`${office.color}20`, color:office.color, border:`1px solid ${office.color}40`, marginBottom:6 }}>{office.type}</span>
                    <h2 style={{ fontSize:24, fontWeight:800 }}>{office.city}</h2>
                    <span style={{ color:'var(--text-muted)', fontSize:13 }}>{office.state}</span>
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[
                    { icon:<MapPin size={16}/>, text: office.address },
                    { icon:<Phone size={16}/>, text: office.phone },
                    { icon:<Mail size={16}/>, text: office.email },
                    { icon:<Clock size={16}/>, text: office.hours },
                  ].map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                      <span style={{ color:office.color, flexShrink:0, marginTop:2 }}>{item.icon}</span>
                      <span style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.6 }}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex', gap:12, marginTop:24 }}>
                  <a href={office.mapUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    <MapPin size={14}/> View on Map
                  </a>
                  <a href={`tel:${office.phone}`} className="btn btn-outline btn-sm">
                    <Phone size={14}/> Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom:48 }}>
            <h2 className="section-title">Delivery Coverage Areas</h2>
            <p className="section-subtitle">12-Hour Guaranteed Delivery to these areas.</p>
          </div>
          <div className="grid-2">
            {Object.entries(SERVICE_AREAS).map(([city, areas]) => (
              <div key={city} className="card">
                <h3 style={{ fontSize:20, fontWeight:800, marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
                  <MapPin size={20} color="var(--primary)"/> {city}
                </h3>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                  {areas.map(area => (
                    <span key={area} className="badge badge-primary" style={{ fontSize:12 }}>{area}</span>
                  ))}
                </div>
                <p style={{ color:'var(--text-muted)', fontSize:13, marginTop:16 }}>
                  + Surrounding areas. Call us to confirm delivery to your pincode.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="section">
        <div className="container">
          <div style={{ background:'linear-gradient(135deg,rgba(0,180,216,0.1),rgba(0,119,182,0.05))', border:'1px solid var(--glass-border)', borderRadius:'var(--radius)', padding:40, textAlign:'center' }}>
            <h2 style={{ fontSize:28, fontWeight:800, marginBottom:16 }}>⚡ 12-Hour Delivery Promise</h2>
            <p style={{ color:'var(--text-muted)', fontSize:16, lineHeight:1.8, maxWidth:580, margin:'0 auto 28px' }}>
              Order before 12 PM → Receive by 12 AM<br/>
              Order before 6 PM → Receive by 6 AM next day<br/>
              Our refrigerated delivery vehicles ensure your AW water stays fresh and alkaline.
            </p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="btn btn-primary">Register & Order Now <ArrowRight size={16}/></Link>
              <a href="tel:+918668000000" className="btn btn-outline"><Phone size={16}/> Call to Order</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
