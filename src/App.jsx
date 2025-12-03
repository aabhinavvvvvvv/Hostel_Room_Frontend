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

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      <Route
        path="/"
        element={
          <RoleProtectedRoute allowedRoles={['STUDENT', 'WARDEN', 'ADMIN']}>
            {user?.role === 'STUDENT' && <StudentDashboard />}
            {user?.role === 'WARDEN' && <WardenDashboard />}
            {user?.role === 'ADMIN' && <AdminDashboard />}
          </RoleProtectedRoute>
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

