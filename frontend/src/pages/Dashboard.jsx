import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, FileText, Users, Copy, Droplets, Clock, CheckCircle, Package, CreditCard } from 'lucide-react';

export default function Dashboard() {
  const { user, API } = useAuth();
  const [orders, setOrders]       = useState([]);
  const [bills,  setBills]        = useState([]);
  const [referral, setReferral]   = useState(null);
  const [products, setProducts]   = useState([]);
  const [tab, setTab]             = useState('overview');
  const [loading, setLoading]     = useState(false);

  // Order form
  const [orderForm, setOrderForm] = useState({ productId:'', quantity:1, paymentMethod:'UPI', transactionId:'', gstNumber:'' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [o, b, r, p] = await Promise.all([
      axios.get(`${API}/orders/my`),
      axios.get(`${API}/billing/my`),
      axios.get(`${API}/referral/my`),
      axios.get(`${API}/products`),
    ]);
    setOrders(o.data);
    setBills(b.data);
    setReferral(r.data);
    setProducts(p.data);
    if (p.data[0]) setOrderForm(f => ({ ...f, productId: p.data[0]._id }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/orders`, orderForm);
      toast.success('Order placed! 🚚 Delivery within 12 hours');
      fetchAll();
      setTab('orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const payBill = async (billId) => {
    try {
      await axios.put(`${API}/billing/${billId}/pay`, { paymentMethod:'UPI', transactionId:'TXN'+Date.now() });
      toast.success('Payment successful! Invoice will be emailed.');
      fetchAll();
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  const copyRef = () => {
    navigator.clipboard.writeText(referral?.referralCode || '');
    toast.success('Referral code copied!');
  };

  const TAB_STYLE = (t) => ({
    padding:'10px 22px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:14, transition:'all 0.3s',
    background: tab===t ? 'var(--primary)' : 'var(--glass)',
    color: tab===t ? '#fff' : 'var(--text-muted)',
  });

  const STATUS_COLOR = { Pending:'var(--warning)', Processing:'var(--primary)', 'Out for Delivery':'#a855f7', Delivered:'var(--success)', Cancelled:'var(--danger)' };

  return (
    <div className="page-wrap" style={{ background:'var(--bg)', minHeight:'100vh', padding:'88px 0 60px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Hello, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color:'var(--text-muted)', fontSize:14 }}>Manage your AW Alkaline Water orders & account.</p>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            {referral?.referralCode && (
              <button onClick={copyRef} className="btn btn-outline btn-sm" style={{ gap:6 }}>
                <Copy size={14}/> {referral.referralCode}
              </button>
            )}
            <span className="badge badge-primary" style={{ padding:'8px 16px', fontSize:13 }}>
              {user?.discountPercent > 0 ? `${user.discountPercent}% Discount Active 🎉` : 'Standard Rate'}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid-4" style={{ marginBottom:32 }}>
          {[
            { icon:<ShoppingCart size={24}/>, label:'Total Orders', value: orders.length, color:'var(--primary)' },
            { icon:<FileText size={24}/>,    label:'Pending Bills', value: bills.filter(b=>b.paymentStatus==='Due').length, color:'var(--warning)' },
            { icon:<Users size={24}/>,       label:'Referrals Made', value: referral?.referralCount || 0, color:'var(--gold)' },
            { icon:<Droplets size={24}/>,    label:'Bookings Left', value: user?.bookingsLeft ?? 2, color:'var(--success)' },
          ].map(c => (
            <div key={c.label} className="card" style={{ textAlign:'center' }}>
              <div style={{ width:50, height:50, borderRadius:'50%', background:`${c.color}15`, border:`1px solid ${c.color}30`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', color:c.color }}>{c.icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color:c.color }}>{c.value}</div>
              <div style={{ color:'var(--text-muted)', fontSize:12, marginTop:4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:10, marginBottom:28, flexWrap:'wrap' }}>
          {[['overview','Overview'],['order','Place Order'],['orders','My Orders'],['bills','Bills & Payments'],['referral','Referral']].map(([t, label]) => (
            <button key={t} style={TAB_STYLE(t)} onClick={() => setTab(t)}>{label}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid-2">
            <div className="card">
              <h3 style={{ fontWeight:700, marginBottom:16, display:'flex', gap:8, alignItems:'center' }}><Clock size={18} color="var(--primary)"/>Recent Orders</h3>
              {orders.slice(0,4).map(o => (
                <div key={o._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{o.product?.name || 'AW Alkaline Water'}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:12 }}>Qty: {o.quantity} × ₹{o.pricePerUnit}</div>
                  </div>
                  <span style={{ background: STATUS_COLOR[o.deliveryStatus]+'20', color: STATUS_COLOR[o.deliveryStatus], padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>
                    {o.deliveryStatus}
                  </span>
                </div>
              ))}
              {orders.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:14 }}>No orders yet. Place your first order!</p>}
            </div>
            <div className="card">
              <h3 style={{ fontWeight:700, marginBottom:16, display:'flex', gap:8, alignItems:'center' }}><FileText size={18} color="var(--warning)"/>Pending Bills</h3>
              {bills.filter(b=>b.paymentStatus==='Due').map(b => (
                <div key={b._id} style={{ padding:'12px 0', borderBottom:'1px solid var(--glass-border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>{b.billNumber}</span>
                    <span style={{ color:'var(--gold)', fontWeight:700 }}>₹{b.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div style={{ color:'var(--text-muted)', fontSize:12, marginBottom:8 }}>Due: {new Date(b.dueDate).toLocaleDateString()}</div>
                  <button className="btn btn-primary btn-sm" onClick={() => payBill(b._id)}>
                    <CreditCard size={13}/> Pay Now
                  </button>
                </div>
              ))}
              {bills.filter(b=>b.paymentStatus==='Due').length === 0 && (
                <p style={{ color:'var(--success)', fontSize:14 }}><CheckCircle size={16}/> No pending bills! 🎉</p>
              )}
            </div>
          </div>
        )}

        {/* Place Order */}
        {tab === 'order' && (
          <div style={{ maxWidth:480 }}>
            <div className="card">
              <h3 style={{ fontWeight:800, fontSize:20, marginBottom:24 }}><Package size={20} color="var(--primary)" style={{ marginRight:8 }}/>Place Order</h3>
              {user?.bookingsLeft === 0 ? (
                <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:20, color:'var(--warning)', textAlign:'center' }}>
                  ⚠️ You've used all bookings for this 15-day cycle. Your bookings reset on your next billing date.
                </div>
              ) : (
                <form onSubmit={placeOrder}>
                  <div className="form-group">
                    <label className="form-label">Product</label>
                    <select className="form-select" value={orderForm.productId} onChange={e => setOrderForm({...orderForm, productId: e.target.value})}>
                      {products.map(p => <option key={p._id} value={p._id}>AW Alkaline Water – pH {p.phLevel} – ₹{p.price}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input className="form-input" type="number" min="1" max="50" value={orderForm.quantity}
                      onChange={e => setOrderForm({...orderForm, quantity:parseInt(e.target.value)})} required/>
                    <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>
                      Estimated Total: ₹{(orderForm.quantity * 50 * (1 - (user?.discountPercent||0)/100)).toFixed(2)}
                      {user?.discountPercent > 0 && <span style={{ color:'var(--success)', marginLeft:6 }}>({user.discountPercent}% discount applied!)</span>}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={orderForm.paymentMethod} onChange={e => setOrderForm({...orderForm, paymentMethod: e.target.value})}>
                      <option value="UPI">UPI</option>
                      <option value="Card">Debit/Credit Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cash">Cash on Delivery</option>
                    </select>
                  </div>
                  {orderForm.paymentMethod !== 'Cash' && (
                    <div className="form-group">
                      <label className="form-label">Transaction ID</label>
                      <input className="form-input" placeholder="UPI/Transaction ID" value={orderForm.transactionId}
                        onChange={e => setOrderForm({...orderForm, transactionId: e.target.value})}/>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">GST Number (Optional)</label>
                    <input className="form-input" placeholder="22AAAAA0000A1Z5" value={orderForm.gstNumber}
                      onChange={e => setOrderForm({...orderForm, gstNumber: e.target.value})}/>
                  </div>
                  <div style={{ background:'rgba(0,180,216,0.06)', border:'1px solid rgba(0,180,216,0.2)', borderRadius:10, padding:14, marginBottom:20, fontSize:13, color:'var(--text-muted)' }}>
                    🚚 Delivery within <strong style={{color:'var(--primary)'}}>12 hours</strong> guaranteed to your registered address.<br/>
                    📄 GST invoice will be emailed to you after order.
                  </div>
                  <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent:'center' }}>
                    {loading ? 'Placing Order...' : <>Place Order <ShoppingCart size={16}/></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* My Orders */}
        {tab === 'orders' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Invoice</th><th>Product</th><th>Qty</th><th>Amount</th><th>Payment</th><th>Delivery</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{o.invoiceNumber}</td>
                    <td>{o.product?.name || 'AW Water'}</td>
                    <td>{o.quantity}</td>
                    <td style={{ color:'var(--primary)', fontWeight:700 }}>₹{o.finalPrice?.toFixed(2)}</td>
                    <td><span style={{ background: o.paymentStatus==='Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: o.paymentStatus==='Paid' ? 'var(--success)' : 'var(--warning)', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{o.paymentStatus}</span></td>
                    <td><span style={{ background: STATUS_COLOR[o.deliveryStatus]+'20', color: STATUS_COLOR[o.deliveryStatus], padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{o.deliveryStatus}</span></td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No orders yet.</div>}
          </div>
        )}

        {/* Bills */}
        {tab === 'bills' && (
          <div>
            {bills.map(b => (
              <div key={b._id} className="card" style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>{b.billNumber}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:13, marginTop:4 }}>
                      Period: {new Date(b.periodStart).toLocaleDateString()} – {new Date(b.periodEnd).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:24, fontWeight:800, color: b.paymentStatus==='Paid' ? 'var(--success)' : 'var(--warning)' }}>₹{b.totalAmount?.toFixed(2)}</div>
                    <span style={{ background: b.paymentStatus==='Paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: b.paymentStatus==='Paid' ? 'var(--success)' : 'var(--warning)', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{b.paymentStatus}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:24, marginTop:16, flexWrap:'wrap' }}>
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>Subtotal: ₹{b.subtotal}</span>
                  <span style={{ fontSize:13, color:'var(--success)' }}>Discount: -₹{b.discount?.toFixed(2)}</span>
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>GST (18%): ₹{b.gstAmount?.toFixed(2)}</span>
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>Due: {new Date(b.dueDate).toLocaleDateString()}</span>
                  {b.invoiceSent && <span style={{ fontSize:13, color:'var(--success)' }}>📧 Invoice emailed</span>}
                </div>
                {b.paymentStatus === 'Due' && (
                  <div style={{ marginTop:16, display:'flex', gap:10 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => payBill(b._id)}>
                      <CreditCard size={13}/> Pay Now
                    </button>
                  </div>
                )}
              </div>
            ))}
            {bills.length === 0 && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No bills generated yet. Bills are created every 15 days.</div>}
          </div>
        )}

        {/* Referral */}
        {tab === 'referral' && (
          <div>
            {/* Referral code card */}
            <div className="card" style={{ textAlign:'center', border:'2px solid var(--gold)', marginBottom:24 }}>
              <div style={{ color:'var(--gold)', fontSize:13, fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>Your Referral Code</div>
              <div style={{ fontSize:40, fontWeight:900, letterSpacing:6, background:'linear-gradient(135deg,#ffd700,#f59e0b)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:8 }}>
                {referral?.referralCode}
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:16 }}>
                Share this code with friends. They get 25% lifetime discount when they register. You earn 25% too!
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button onClick={copyRef} className="btn btn-gold btn-sm"><Copy size={14}/> Copy Code</button>
                <Link to={`/register?ref=${referral?.referralCode}`} className="btn btn-outline btn-sm">Share Link</Link>
              </div>
              <div style={{ display:'flex', gap:24, justifyContent:'center', marginTop:24 }}>
                <div>
                  <div style={{ fontSize:28, fontWeight:800, color:'var(--gold)' }}>{referral?.referralCount || 0}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Referrals Made</div>
                </div>
                <div>
                  <div style={{ fontSize:28, fontWeight:800, color:'var(--success)' }}>{user?.discountPercent || 0}%</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Your Discount</div>
                </div>
              </div>
            </div>

            {/* Referred users */}
            {referral?.referrals?.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Referred Person</th><th>Email</th><th>Joined</th><th>Discount Given</th></tr></thead>
                  <tbody>
                    {referral.referrals.map(r => (
                      <tr key={r._id}>
                        <td style={{ fontWeight:600 }}>{r.referee?.name}</td>
                        <td style={{ color:'var(--text-muted)' }}>{r.referee?.email}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:13 }}>{new Date(r.referee?.createdAt).toLocaleDateString()}</td>
                        <td><span className="badge badge-gold">25% Lifetime</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
