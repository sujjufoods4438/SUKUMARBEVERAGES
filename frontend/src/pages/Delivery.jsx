import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, CheckCircle, Navigation, Camera, LocateFixed, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Delivery() {
  const { user, API } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${user.token}` } });
      // In a real app, filter by assigned partner
      setOrders(data.filter(o => o.deliveryStatus === 'Processing' || o.deliveryStatus === 'Out for Delivery'));
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (orderId) => {
    setCompleting(true);
    try {
      // Mocking photo and GPS data
      const mockData = {
        deliveryPhoto: 'https://images.unsplash.com/photo-1582213726893-ed2e00b3ee21?auto=format&fit=crop&w=300&q=80',
        deliveryGPS: { lat: 16.5062, lng: 80.6480 } // Vijayawada
      };
      await axios.put(`${API}/orders/${orderId}/complete`, mockData, { headers: { Authorization: `Bearer ${user.token}` } });
      toast.success('Delivery Completed Successfully!');
      setActiveOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to complete delivery');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="page-wrap flex items-center justify-center"><div className="spinner"/></div>;

  return (
    <div className="page-wrap" style={{ background: '#0a0a0a', minHeight: '100vh', padding: '80px 16px 40px', color: '#fff' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        
        {activeOrder ? (
          <div style={{ animation: 'slideUp 0.4s ease' }}>
            {/* Active Delivery View (Zepto Style) */}
            <div style={{ background: 'linear-gradient(180deg, #121212, #000)', borderRadius: 24, padding: 24, border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>Active Order</h2>
                  <p style={{ color: '#888', fontSize: 14 }}>Task ID: {activeOrder._id.substring(0, 8)}</p>
                </div>
                <div style={{ background: '#22c55e20', color: '#22c55e', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, height: 'fit-content' }}>
                  {activeOrder.deliveryStatus}
                </div>
              </div>

              {/* Map Placeholder */}
              <div style={{ width: '100%', height: 200, background: '#1a1a1a', borderRadius: 16, marginBottom: 24, position: 'relative', overflow: 'hidden', border: '1px solid #333' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Navigation size={48} color="var(--primary)" style={{ opacity: 0.5 }}/>
                  <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Live GPS Tracking Enabled</p>
                </div>
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.8)', padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <Clock size={14} color="var(--primary)"/> 8 mins away
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ background: '#1a1a1a', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>
                    {activeOrder.user?.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>{activeOrder.user?.name}</h3>
                    <p style={{ color: '#888', fontSize: 14 }}>{activeOrder.user?.phone}</p>
                  </div>
                  <a href={`tel:${activeOrder.user?.phone}`} style={{ width: 40, height: 40, borderRadius: '50%', background: '#22c55e20', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={20}/>
                  </a>
                </div>
                <div style={{ display: 'flex', gap: 12, color: '#aaa', fontSize: 14 }}>
                  <MapPin size={18} color="var(--primary)"/>
                  <span>{activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city}</span>
                </div>
              </div>

              {/* Order Details */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>Items</span>
                  <span style={{ fontWeight: 700 }}>{activeOrder.quantity} x AW Alkaline Water</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888' }}>Weight</span>
                  <span style={{ fontWeight: 700 }}>{activeOrder.quantity} Litres</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <button className="btn btn-outline" style={{ background: '#222', borderColor: '#444', color: '#fff', justifyContent: 'center' }}>
                  <Camera size={18} style={{ marginRight: 8 }}/> Take Photo
                </button>
                <button className="btn btn-outline" style={{ background: '#222', borderColor: '#444', color: '#fff', justifyContent: 'center' }}>
                  <LocateFixed size={18} style={{ marginRight: 8 }}/> Tag GPS
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ gridColumn: 'span 2', height: 56, fontSize: 18, fontWeight: 800, justifyContent: 'center' }}
                  onClick={() => handleComplete(activeOrder._id)}
                  disabled={completing}
                >
                  {completing ? 'Processing...' : 'Complete Delivery'}
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveOrder(null)}
              style={{ width: '100%', marginTop: 20, background: 'none', border: 'none', color: '#666', fontSize: 14, cursor: 'pointer' }}
            >
              Cancel and Return to List
            </button>
          </div>
        ) : (
          <div>
            {/* Task List View */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 900 }}>My Tasks</h1>
              <div style={{ background: 'var(--primary)20', color: 'var(--primary)', padding: '6px 12px', borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
                {orders.length} Pending
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>
                  <CheckCircle size={64} style={{ opacity: 0.1, marginBottom: 16 }}/>
                  <p>All clear! No tasks assigned.</p>
                </div>
              ) : (
                orders.map(o => (
                  <div 
                    key={o._id} 
                    className="card" 
                    style={{ background: '#121212', border: '1px solid #222', cursor: 'pointer', transition: '0.2s' }}
                    onClick={() => setActiveOrder(o)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: '#666' }}>ID: {o._id.substring(0, 8)}</span>
                      <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>{o.deliveryTime}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{o.user?.name}</h3>
                    <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{o.deliveryAddress.street}, {o.deliveryAddress.city}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ background: '#222', padding: '4px 10px', borderRadius: 6, fontSize: 11 }}>{o.quantity} Bottles</span>
                        <span style={{ background: '#222', padding: '4px 10px', borderRadius: 6, fontSize: 11 }}>UPI Paid</span>
                      </div>
                      <div style={{ color: 'var(--primary)' }}>
                        <Navigation size={18}/>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
