import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await api.get('/applications/me');
      if (response.data.success) {
        setApplication(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!application) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Application Found</h2>
        <p className="text-gray-600 mb-6">You haven't submitted an application yet.</p>
        <Link
          to="/student/apply"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Application
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ALLOCATED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'WAITLISTED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Application Status</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Application Details</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <span className="font-medium">Applied At:</span>{' '}
            {new Date(application.appliedAt).toLocaleString()}
          </div>
          {application.priorityCategory && (
            <div>
              <span className="font-medium">Priority Category:</span>{' '}
              {application.priorityCategory}
            </div>
          )}
          {application.waitlistEntry && (
            <div>
              <span className="font-medium">Waitlist Rank:</span>{' '}
              {application.waitlistEntry.rank}
            </div>
          )}
        </div>

        {application.preferences && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Preferences</h3>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(application.preferences, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {application.allocations && application.allocations.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Allocation Details</h2>
          {application.allocations.map((allocation) => (
            <div key={allocation.id} className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Hostel:</span>{' '}
                  {allocation.room.block.hostel.name}
                </div>
                <div>
                  <span className="font-medium">Block:</span> {allocation.room.block.name}
                </div>
                <div>
                  <span className="font-medium">Room:</span> {allocation.room.number}
                </div>
                <div>
                  <span className="font-medium">Bed:</span> {allocation.bed.bedNumber}
                </div>
                <div>
                  <span className="font-medium">Allocated At:</span>{' '}
                  {new Date(allocation.allocatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {application.status === 'PENDING' && (
        <div className="mt-6 text-center">
          <Link
            to="/student/apply"
            className="text-blue-600 hover:text-blue-800"
          >
            Update Application
          </Link>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;

