import { Routes, Route } from 'react-router-dom';
import AdminConsole from './AdminConsole';
import HostelManagement from './HostelManagement';
import AllocationControl from './AllocationControl';
import Reports from './Reports';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={<AdminConsole />} />
        <Route path="/hostels" element={<HostelManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/allocation" element={<AllocationControl />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;

