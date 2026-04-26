import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, ShoppingCart, FileText, TrendingUp, MapPin, RefreshCw, CheckCircle } from 'lucide-react';

export default function Admin() {
  const { API } = useAuth();
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [bills,  setBills]  = useState([]);
  const [tab, setTab]       = useState('stats');
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [s, u, o, b] = await Promise.all([
      axios.get(`${API}/admin/stats`),
      axios.get(`${API}/admin/users`),
      axios.get(`${API}/orders`),
      axios.get(`${API}/billing`),
    ]);
    setStats(s.data);
    setUsers(u.data);
    setOrders(o.data);
    setBills(b.data);
  };

  const generateBills = async () => {
    setGenLoading(true);
    try {
      const { data } = await axios.post(`${API}/billing/generate`, { gstNumber:'29XXXXXXXXXXXX' });
      toast.success(`${data.bills?.length} bills generated & emailed!`);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setGenLoading(false);
    }
  };

  const updateDelivery = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}/status`, { deliveryStatus: status });
      toast.success('Status updated');
      fetchAll();
    } catch{ toast.error('Failed'); }
  };

  const seedProduct = async () => {
    try {
      const { data } = await axios.post(`${API}/products/seed`);
      toast.success('Product seeded: ' + data.product?.name);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const TAB_STYLE = (t) => ({
    padding:'10px 22px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:14, transition:'all 0.3s',
    background: tab===t ? 'var(--primary)' : 'var(--glass)',
    color: tab===t ? '#fff' : 'var(--text-muted)',
  });

  const STATUS_COLOR = { Pending:'var(--warning)', Processing:'var(--primary)', 'Out for Delivery':'#a855f7', Delivered:'var(--success)', Cancelled:'var(--danger)' };

  return (
    <div className="page-wrap" style={{ padding:'88px 0 60px', background:'var(--bg)' }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Admin Dashboard</h1>
            <p style={{ color:'var(--text-muted)', fontSize:14 }}>AW Alkaline Water – Sukumar Industries</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={seedProduct} className="btn btn-outline btn-sm">Seed Product</button>
            <button onClick={generateBills} className="btn btn-gold btn-sm" disabled={genLoading}>
              {genLoading ? 'Generating...' : <><FileText size={14}/> Generate 15-Day Bills</>}
            </button>
            <button onClick={fetchAll} className="btn btn-outline btn-sm"><RefreshCw size={14}/></button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid-4" style={{ marginBottom:32 }}>
            {[
              { icon:<Users size={24}/>,       label:'Total Customers', value:stats.totalUsers,   color:'var(--primary)' },
              { icon:<ShoppingCart size={24}/>, label:'Total Orders',    value:stats.totalOrders,  color:'var(--gold)' },
              { icon:<TrendingUp size={24}/>,   label:'Revenue (₹)',     value:`₹${stats.totalRevenue?.toFixed(0)}`, color:'var(--success)' },
              { icon:<FileText size={24}/>,     label:'Pending Bills',   value:stats.pendingBills, color:'var(--warning)' },
            ].map(c => (
              <div key={c.label} className="card" style={{ textAlign:'center' }}>
                <div style={{ width:50, height:50, borderRadius:'50%', background:`${c.color}15`, border:`1px solid ${c.color}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', color:c.color }}>{c.icon}</div>
                <div style={{ fontSize:28, fontWeight:800, color:c.color }}>{c.value}</div>
                <div style={{ color:'var(--text-muted)', fontSize:12, marginTop:4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* City wise */}
        {stats && (
          <div className="grid-2" style={{ marginBottom:32 }}>
            {[['Vijayawada',stats.cityWise?.vijayawada],['Hyderabad',stats.cityWise?.hyderabad]].map(([city, count]) => (
              <div key={city} className="card" style={{ display:'flex', alignItems:'center', gap:16 }}>
                <MapPin size={32} color="var(--primary)"/>
                <div>
                  <div style={{ fontWeight:700, fontSize:18 }}>{city}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:13 }}>{count} Customers</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
          {[
            ['stats','Customers'],
            ['orders','Orders'],
            ['bills','Bills'],
            ['distributors','Distributors'],
            ['delivery','Delivery Partners'],
            ['tracking','Live Tracking']
          ].map(([t,l]) => (
            <button key={t} style={TAB_STYLE(t)} onClick={() => setTab(t)}>{l}</button>
          ))}
        </div>

        {/* Customers */}
        {tab === 'stats' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Role</th><th>Discount</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight:600 }}>{u.name}</td>
                    <td style={{ color:'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ color:'var(--text-muted)' }}>{u.phone}</td>
                    <td><span className="badge badge-primary" style={{ fontSize:11 }}>{u.address?.city}</span></td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'distributor' ? 'gold' : u.role === 'delivery' ? 'warning' : 'primary'}`} style={{ fontSize:10 }}>{u.role.toUpperCase()}</span></td>
                    <td style={{ color:'var(--success)', fontWeight:700 }}>{u.discountPercent}%</td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ padding:'4px 8px', fontSize:10 }}>Edit Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No users yet.</div>}
          </div>
        )}

        {/* Distributors */}
        {tab === 'distributors' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Distributor Name</th><th>Phone</th><th>Email</th><th>Region</th><th>Total Orders</th><th>Revenue Generated</th></tr></thead>
              <tbody>
                {users.filter(u => u.role === 'distributor').map(d => (
                  <tr key={d._id}>
                    <td style={{ fontWeight:600 }}>{d.name}</td>
                    <td>{d.phone}</td>
                    <td>{d.email}</td>
                    <td>{d.address?.city}</td>
                    <td>{orders.length}</td>
                    <td style={{ color:'var(--primary)', fontWeight:700 }}>₹{(orders.length * 50).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.filter(u => u.role === 'distributor').length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No distributors found. Assign users to the distributor role.</div>}
          </div>
        )}

        {/* Delivery Partners */}
        {tab === 'delivery' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Partner Name</th><th>Phone</th><th>Vehicle</th><th>Number</th><th>Current Status</th><th>Actions</th></tr></thead>
              <tbody>
                {users.filter(u => u.role === 'delivery').map(dp => (
                  <tr key={dp._id}>
                    <td style={{ fontWeight:600 }}>{dp.name}</td>
                    <td>{dp.phone}</td>
                    <td>{dp.vehicleDetails?.type || 'Bike'}</td>
                    <td>{dp.vehicleDetails?.number || 'AP07 BX 1234'}</td>
                    <td><span className="badge badge-success">Online</span></td>
                    <td><button className="btn btn-outline btn-sm" style={{ padding:'4px 8px', fontSize:10 }}>Track</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Live Tracking */}
        {tab === 'tracking' && (
          <div className="card" style={{ padding:0, overflow:'hidden', minHeight:500 }}>
            <div style={{ padding:20, borderBottom:'1px solid var(--glass-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:18, fontWeight:700 }}>Real-Time Vehicle Tracking</h3>
              <div style={{ display:'flex', gap:8 }}>
                <span className="badge badge-success">4 Vehicles Online</span>
                <span className="badge badge-warning">2 Out for Delivery</span>
              </div>
            </div>
            <div style={{ height:400, background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
              <MapPin size={48} color="var(--primary)" style={{ opacity:0.5, marginBottom:16 }}/>
              <p style={{ color:'var(--text-muted)' }}>Interactive Map View (Google Maps Integration)</p>
              <div style={{ display:'flex', gap:20, marginTop:24 }}>
                {users.filter(u => u.role === 'delivery').map((dp, i) => (
                  <div key={i} style={{ textAlign:'center' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', fontWeight:800 }}>{dp.name[0]}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>{dp.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Invoice</th><th>Customer</th><th>Qty</th><th>Amount</th><th>Payment</th><th>Delivery Status</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontSize:11, color:'var(--text-muted)' }}>{o.invoiceNumber}</td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:13 }}>{o.user?.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{o.user?.phone}</div>
                    </td>
                    <td>{o.quantity}</td>
                    <td style={{ color:'var(--primary)', fontWeight:700 }}>₹{o.finalPrice?.toFixed(2)}</td>
                    <td><span style={{ background: o.paymentStatus==='Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: o.paymentStatus==='Paid' ? 'var(--success)' : 'var(--warning)', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{o.paymentStatus}</span></td>
                    <td><span style={{ background: STATUS_COLOR[o.deliveryStatus]+'20', color: STATUS_COLOR[o.deliveryStatus], padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{o.deliveryStatus}</span></td>
                    <td>
                      <select style={{ background:'var(--bg2)', border:'1px solid var(--glass-border)', color:'var(--text)', fontSize:12, padding:'4px 8px', borderRadius:6, cursor:'pointer' }}
                        value={o.deliveryStatus} onChange={e => updateDelivery(o._id, e.target.value)}>
                        {['Pending','Processing','Out for Delivery','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No orders yet.</div>}
          </div>
        )}

        {/* Bills */}
        {tab === 'bills' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Bill No</th><th>Customer</th><th>Period</th><th>Total</th><th>GST</th><th>Status</th><th>Invoice</th></tr></thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'monospace' }}>{b.billNumber}</td>
                    <td>
                      <div style={{ fontWeight:600, fontSize:13 }}>{b.user?.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(b.periodStart).toLocaleDateString()} – {new Date(b.periodEnd).toLocaleDateString()}</td>
                    <td style={{ fontWeight:700, color:'var(--primary)' }}>₹{b.totalAmount?.toFixed(2)}</td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>₹{b.gstAmount?.toFixed(2)}</td>
                    <td><span style={{ background: b.paymentStatus==='Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: b.paymentStatus==='Paid' ? 'var(--success)' : 'var(--warning)', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{b.paymentStatus}</span></td>
                    <td>{b.invoiceSent ? <span style={{ color:'var(--success)', fontSize:12 }}><CheckCircle size={13}/> Sent</span> : <span style={{ color:'var(--text-muted)', fontSize:12 }}>Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bills.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No bills generated yet. Click "Generate 15-Day Bills".</div>}
          </div>
        )}
      </div>
    </div>
  );
}
