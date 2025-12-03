import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const MyAllocation = () => {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllocation();
  }, []);

  const fetchAllocation = async () => {
    try {
      const response = await api.get('/applications/me');
      if (response.data.success && response.data.data) {
        const app = response.data.data;
        if (app.allocations && app.allocations.length > 0) {
          setAllocation(app.allocations[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch allocation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!allocation) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">No Allocation Found</h2>
        <p className="text-gray-600">
          You haven't been allocated a room yet. Please check your application status.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Allocation</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Room Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-600">Hostel:</span>
            <p className="text-lg">{allocation.room.block.hostel.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Block:</span>
            <p className="text-lg">{allocation.room.block.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Floor:</span>
            <p className="text-lg">{allocation.room.floor.floorNumber}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Room Number:</span>
            <p className="text-lg">{allocation.room.number}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Bed Number:</span>
            <p className="text-lg">{allocation.bed.bedNumber}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Room Capacity:</span>
            <p className="text-lg">{allocation.room.capacity} beds</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-2">Room Features</h3>
          <div className="flex flex-wrap gap-2">
            {allocation.room.features?.ac && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                AC
              </span>
            )}
            {allocation.room.features?.attachedBathroom && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Attached Bathroom
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600">
            Allocated on: {new Date(allocation.allocatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyAllocation;

