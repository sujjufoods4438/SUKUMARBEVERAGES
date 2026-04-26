import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ShoppingBag, Truck, BarChart3, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Distributor() {
  const { user, API } = useAuth();
  const [activeTab, setActiveTab] = useState('customers');
  const [data, setData] = useState({ customers: [], orders: [], deliveries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch distributor specific data (for demo, fetching all but in real app would be filtered)
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${user.token}` } }),
          axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${user.token}` } })
        ]);
        setData({
          customers: usersRes.data.filter(u => u.role === 'customer'),
          orders: ordersRes.data,
          deliveries: ordersRes.data.filter(o => o.deliveryStatus !== 'Delivered')
        });
      } catch (err) {
        toast.error('Failed to load distributor data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-wrap flex items-center justify-center"><div className="spinner"/></div>;

  return (
    <div className="page-wrap" style={{ background: 'var(--bg2)', padding: '100px 0 40px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 4 }}>Distributor Panel</h1>
            <p className="text-muted">Welcome back, {user.name}. Manage your region's operations.</p>
          </div>
          <div className="badge badge-gold">Active Distributor</div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Total Customers', value: data.customers.length, icon: <Users size={20}/>, color: 'var(--primary)' },
            { label: 'Total Orders', value: data.orders.length, icon: <ShoppingBag size={20}/>, color: 'var(--success)' },
            { label: 'Pending Deliveries', value: data.deliveries.length, icon: <Truck size={20}/>, color: 'var(--warning)' },
            { label: 'Regional Revenue', value: '₹' + (data.orders.length * 50).toLocaleString(), icon: <BarChart3 size={20}/>, color: 'var(--gold)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + '15', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
            {[
              { id: 'customers', label: 'My Customers', icon: <Users size={16}/> },
              { id: 'orders', label: 'Order History', icon: <ShoppingBag size={16}/> },
              { id: 'deliveries', label: 'Pending Deliveries', icon: <Truck size={16}/> },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '16px 24px',
                  border: 'none',
                  background: 'none',
                  color: activeTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  borderBottom: activeTab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: '0.2s'
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {activeTab === 'customers' && (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Bookings Left</th>
                      <th>Registration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.customers.map(c => (
                      <tr key={c._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</div>
                        </td>
                        <td>{c.phone}</td>
                        <td>{c.address.city}</td>
                        <td>{c.bookingsLeft}</td>
                        <td>
                          <span className="badge badge-success" style={{ fontSize: 10 }}>PAID ₹1500</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{o._id.substring(0, 8)}</td>
                        <td>{o.user?.name}</td>
                        <td>{o.quantity} Bottle(s)</td>
                        <td>₹{o.finalPrice}</td>
                        <td>
                          <span className={`badge badge-${o.deliveryStatus === 'Delivered' ? 'success' : o.deliveryStatus === 'Cancelled' ? 'danger' : 'warning'}`}>
                            {o.deliveryStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'deliveries' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {data.deliveries.length === 0 ? (
                  <p className="text-muted text-center py-10">No pending deliveries in your queue.</p>
                ) : (
                  data.deliveries.map(o => (
                    <div key={o._id} className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {o._id.substring(0, 8)}</span>
                        <span className="badge badge-warning">{o.deliveryStatus}</span>
                      </div>
                      <h4 style={{ marginBottom: 4 }}>{o.user?.name}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                        {o.deliveryAddress.street}, {o.deliveryAddress.city}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
                        <span style={{ fontWeight: 700 }}>{o.quantity} Bottles</span>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>Assign Partner</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
