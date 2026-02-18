import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ComplaintForm from '@/pages/ComplaintForm';
import ComplaintDetail from '@/pages/ComplaintDetail';
import ComplaintList from '@/pages/ComplaintList';
import AdminPanel from '@/pages/AdminPanel';
import OfficerPanel from '@/pages/OfficerPanel';
import UserManagement from '@/pages/UserManagement';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

// Components
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Chatbot } from '@/components/Chatbot';

// Store
import { initializeAuth, useAuthStore } from '@/store/authStore';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />

        <Chatbot />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' || user?.role === 'superadmin' ? '/admin' : '/dashboard'} /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={user?.role === 'admin' || user?.role === 'superadmin' ? '/admin' : '/dashboard'} /> : <Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <><Navbar /><Dashboard /><Footer /></>
            </ProtectedRoute>
          } />

          <Route path="/report" element={
            <ProtectedRoute>
              <><Navbar /><ComplaintForm /><Footer /></>
            </ProtectedRoute>
          } />

          <Route path="/complaints" element={
            <ProtectedRoute>
              <><Navbar /><ComplaintList /><Footer /></>
            </ProtectedRoute>
          } />

          <Route path="/complaint/:id" element={
            <ProtectedRoute>
              <><Navbar /><ComplaintDetail /><Footer /></>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <><Navbar /><Profile /><Footer /></>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <><Navbar /><AdminPanel /><Footer /></>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <><Navbar /><UserManagement /><Footer /></>
            </ProtectedRoute>
          } />

          {/* Officer routes */}
          <Route path="/officer" element={
            <ProtectedRoute allowedRoles={['officer', 'admin', 'superadmin']}>
              <><Navbar /><OfficerPanel /><Footer /></>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
