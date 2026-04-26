import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

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
import FirebaseAuth from './pages/FirebaseAuth';
import VerifyEmail from './pages/VerifyEmail';

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
      <Route path="/" element={<Layout><Home/></Layout>}/>
      <Route path="/benefits" element={<Layout><Benefits/></Layout>}/>
      <Route path="/process" element={<Layout><Process/></Layout>}/>
      <Route path="/pricing" element={<Layout><Pricing/></Layout>}/>
      <Route path="/locations" element={<Layout><Locations/></Layout>}/>
      <Route path="/book-water" element={<Layout><BookWater/></Layout>}/>

      <Route path="/login" element={<Layout withFooter={false}><Login/></Layout>}/>
      <Route path="/register" element={<Layout withFooter={false}><Register/></Layout>}/>
      <Route path="/firebase-auth" element={<FirebaseAuth/>}/>
      <Route path="/verify-email" element={<VerifyEmail/>}/>

      <Route path="/dashboard" element={<Layout><Dashboard/></Layout>}/>
      <Route path="/admin" element={<Layout><Admin/></Layout>}/>
      <Route path="/distributor" element={<Layout><Distributor/></Layout>}/>
      <Route path="/delivery" element={<Layout><Delivery/></Layout>}/>

      <Route path="*" element={<Navigate to="/"/>}/>
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
