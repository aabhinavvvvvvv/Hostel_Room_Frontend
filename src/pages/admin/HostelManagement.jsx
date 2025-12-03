import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const HostelManagement = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', gender: 'MALE' });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await api.get('/hostels');
      if (response.data.success) {
        setHostels(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/hostels', formData);
      if (response.data.success) {
        toast.success('Hostel created successfully');
        setShowCreateForm(false);
        setFormData({ name: '', gender: 'MALE' });
        fetchHostels();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create hostel';
      toast.error(message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hostel Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Create Hostel'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Hostel</h2>
          <form onSubmit={handleCreateHostel} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{hostel.name}</h3>
                <p className="text-gray-600">{hostel.gender}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Blocks:</span>{' '}
                <span className="font-medium">{hostel.blocks.length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Rooms:</span>{' '}
                <span className="font-medium">
                  {hostel.blocks.reduce(
                    (sum, block) =>
                      sum +
                      block.floors.reduce(
                        (floorSum, floor) => floorSum + floor.rooms.length,
                        0
                      ),
                    0
                  )}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Beds:</span>{' '}
                <span className="font-medium">
                  {hostel.blocks.reduce(
                    (sum, block) =>
                      sum +
                      block.floors.reduce(
                        (floorSum, floor) =>
                          floorSum +
                          floor.rooms.reduce(
                            (roomSum, room) => roomSum + room.beds.length,
                            0
                          ),
                        0
                      ),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostelManagement;

