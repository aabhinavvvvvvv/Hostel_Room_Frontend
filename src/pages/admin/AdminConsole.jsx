import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminConsole = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/allocate/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Console</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/users"
          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600">Create and manage users (Admin/Warden/Student)</p>
        </Link>

        <Link
          to="/admin/hostels"
          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Hostel Management</h2>
          <p className="text-gray-600">Manage hostels, blocks, floors, and rooms</p>
        </Link>

        <Link
          to="/admin/allocation"
          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Allocation Control</h2>
          <p className="text-gray-600">Run allocation engine and manage allocations</p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p className="text-gray-600">View and export reports</p>
        </Link>
      </div>

      {stats && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Applications</div>
              <div className="text-2xl font-bold">{stats.applications.total}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.applications.pending}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Allocated</div>
              <div className="text-2xl font-bold text-green-600">{stats.applications.allocated}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Waitlisted</div>
              <div className="text-2xl font-bold text-blue-600">{stats.applications.waitlisted}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Beds</div>
              <div className="text-2xl font-bold">{stats.beds.total}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Occupied</div>
              <div className="text-2xl font-bold">{stats.beds.occupied}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Available</div>
              <div className="text-2xl font-bold text-green-600">{stats.beds.available}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
              <div className="text-2xl font-bold">{stats.beds.occupancyRate}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;

