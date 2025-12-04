import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/shared/NavBar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import WardenDashboard from './pages/warden/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import RoleProtectedRoute from './components/shared/RoleProtectedRoute';
import LoadingSpinner from './components/shared/LoadingSpinner';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      
      <Route
        path="/"
        element={
          user ? (
            <RoleProtectedRoute allowedRoles={['STUDENT', 'WARDEN', 'ADMIN']}>
              {user?.role === 'STUDENT' && <StudentDashboard />}
              {user?.role === 'WARDEN' && <WardenDashboard />}
              {user?.role === 'ADMIN' && <AdminDashboard />}
            </RoleProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/student/*"
        element={
          <RoleProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </RoleProtectedRoute>
        }
      />
      
      <Route
        path="/warden/*"
        element={
          <RoleProtectedRoute allowedRoles={['WARDEN', 'ADMIN']}>
            <WardenDashboard />
          </RoleProtectedRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

