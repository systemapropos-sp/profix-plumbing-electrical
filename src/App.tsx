import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuotesPage from './pages/QuotesPage';
import JobsPage from './pages/JobsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import CustomersPage from './pages/CustomersPage';
import InventoryPage from './pages/InventoryPage';
import FinancesPage from './pages/FinancesPage';
import SettingsPage from './pages/SettingsPage';
import GpsTrackingPage from './pages/GpsTrackingPage';
import QuoteApprovalPage from './pages/QuoteApprovalPage';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#1e3a5f] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/quote-approval/:token" element={<QuoteApprovalPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/quotes" element={<QuotesPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/employees" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><EmployeesPage /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><CustomersPage /></ProtectedRoute>} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/finances" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><FinancesPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><SettingsPage /></ProtectedRoute>} />
                <Route path="/gps" element={<ProtectedRoute allowedRoles={['admin', 'supervisor']}><GpsTrackingPage /></ProtectedRoute>} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
