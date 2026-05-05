import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Search from './pages/Search';
import Results from './pages/Results';
import BusDetail from './pages/BusDetail';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import ManageBuses from './pages/admin/ManageBuses';
import Navbar from './components/Navbar';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.roles?.includes('Admin')) return <Navigate to="/" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login"    element={!user ? <PageWrapper><Login /></PageWrapper>    : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <PageWrapper><Register /></PageWrapper> : <Navigate to="/" replace />} />
        <Route path="/" element={
          <ProtectedRoute><PageWrapper><Search /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute><PageWrapper><Results /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/schedule/:id" element={
          <ProtectedRoute><PageWrapper><BusDetail /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><PageWrapper><MyBookings /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/admin/buses" element={
          <ProtectedRoute adminOnly><PageWrapper><ManageBuses /></PageWrapper></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}