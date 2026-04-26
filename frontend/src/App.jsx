import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import Home      from './pages/Home';
import Benefits  from './pages/Benefits';
import Process   from './pages/Process';
import Pricing   from './pages/Pricing';
import Locations from './pages/Locations';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin     from './pages/Admin';
import BookWater from './pages/BookWater';
import Distributor from './pages/Distributor';
import Delivery    from './pages/Delivery';
import Chatbot     from './components/Chatbot';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}><div className="spinner"/></div>;
  return user ? children : <Navigate to="/login"/>;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}><div className="spinner"/></div>;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard"/>;
};

const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}><div className="spinner"/></div>;
  return user && roles.includes(user.role) ? children : <Navigate to="/login"/>;
};

// Pages with nav+footer
const Layout = ({ children, withFooter = true }) => (
  <>
    <Navbar/>
    {children}
    {withFooter && <Footer/>}
    <Chatbot/>
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"         element={<ProtectedRoute><Layout><Home/></Layout></ProtectedRoute>}/>
      <Route path="/benefits" element={<ProtectedRoute><Layout><Benefits/></Layout></ProtectedRoute>}/>
      <Route path="/process"  element={<ProtectedRoute><Layout><Process/></Layout></ProtectedRoute>}/>
      <Route path="/pricing"  element={<ProtectedRoute><Layout><Pricing/></Layout></ProtectedRoute>}/>
      <Route path="/locations"element={<ProtectedRoute><Layout><Locations/></Layout></ProtectedRoute>}/>
      <Route path="/book-water" element={<Layout><BookWater/></Layout>}/>

      <Route path="/login"    element={<Layout withFooter={false}><Login/></Layout>}/>
      <Route path="/register" element={<Layout withFooter={false}><Register/></Layout>}/>

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard/></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/admin" element={
        <AdminRoute>
          <Layout><Admin/></Layout>
        </AdminRoute>
      }/>
      <Route path="/distributor" element={
        <RoleRoute roles={['distributor', 'admin']}>
          <Layout><Distributor/></Layout>
        </RoleRoute>
      }/>
      <Route path="/delivery" element={
        <RoleRoute roles={['delivery', 'admin']}>
          <Layout><Delivery/></Layout>
        </RoleRoute>
      }/>

      <Route path="*" element={<Navigate to="/login"/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background:'#062035', color:'#e0f4ff', border:'1px solid rgba(0,180,216,0.3)', borderRadius:10, fontSize:14 },
          success: { iconTheme: { primary:'#22c55e', secondary:'#fff' }},
          error:   { iconTheme: { primary:'#ef4444', secondary:'#fff' }},
        }}/>
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  );
}
