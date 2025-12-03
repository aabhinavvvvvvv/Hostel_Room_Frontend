import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ApplyForm = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferredHostels: [],
    roomType: 'STANDARD',
    roommatePreferences: {},
    priorityCategory: '',
  });
  const navigate = useNavigate();

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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHostelToggle = (hostelId) => {
    setFormData((prev) => {
      const hostels = prev.preferredHostels || [];
      if (hostels.includes(hostelId)) {
        return {
          ...prev,
          preferredHostels: hostels.filter((id) => id !== hostelId),
        };
      } else {
        return {
          ...prev,
          preferredHostels: [...hostels, hostelId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/applications', {
        preferences: {
          preferredHostels: formData.preferredHostels,
          roomType: formData.roomType,
          roommatePreferences: formData.roommatePreferences,
        },
        priorityCategory: formData.priorityCategory || null,
      });

      if (response.data.success) {
        toast.success('Application submitted successfully');
        navigate('/student');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Room Application</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Hostels (Select one or more)
          </label>
          <div className="space-y-2">
            {hostels.map((hostel) => (
              <label key={hostel.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferredHostels.includes(hostel.id)}
                  onChange={() => handleHostelToggle(hostel.id)}
                  className="mr-2"
                />
                <span>
                  {hostel.name} ({hostel.gender})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <select
            id="roomType"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="STANDARD">Standard</option>
            <option value="AC">AC</option>
            <option value="DELUXE">Deluxe</option>
          </select>
        </div>

        <div>
          <label htmlFor="priorityCategory" className="block text-sm font-medium text-gray-700 mb-2">
            Priority Category (Optional)
          </label>
          <select
            id="priorityCategory"
            name="priorityCategory"
            value={formData.priorityCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None</option>
            <option value="HANDICAPPED">Handicapped</option>
            <option value="MERIT">Merit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roommate Preferences (Optional)
          </label>
          <textarea
            name="roommatePreferences"
            rows={4}
            placeholder='e.g., {"preferredGender": "MALE", "nonSmoker": true}'
            value={JSON.stringify(formData.roommatePreferences)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData({ ...formData, roommatePreferences: parsed });
              } catch {
                // Invalid JSON, ignore
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.preferredHostels.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;

