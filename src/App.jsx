import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/header.jsx';
import Hero from './components/hero.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import VerifyEmail from './pages/verify-email.jsx';
import ForgotPassword from './pages/forgot-password.jsx';
import DashboardLayout from "./layout/dashboard.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Settings from "./pages/settings.jsx";
import Search from './pages/search.jsx';
import Moviedisplay from './components/Moviedisplay.jsx';
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#000',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #333',
          borderTop: '4px solid #E50914',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#fff', marginTop: '20px', fontFamily: 'Poppins, sans-serif' }}>Loading StreamBox...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <main>
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot-password' && location.pathname !== '/dashboard' && <Header />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route path='' element={<Dashboard />} />
          <Route path='settings' element={<Settings />} />
        </Route>
        <Route path='/search' element={<Search />} />
        {/* <Route path='/movie/:id' element={<Moviedisplay />} /> */}
      </Routes>
    </main>
  );
}

export default App;
