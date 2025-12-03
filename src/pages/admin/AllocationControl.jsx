import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AllocationControl = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunAllocation = async () => {
    if (!confirm('Are you sure you want to run the allocation engine? This will process all pending applications.')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/allocate/run');
      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Allocation run completed successfully');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to run allocation';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Allocation Control</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Run Allocation Engine</h2>
        <p className="text-gray-600 mb-6">
          This will process all pending and waitlisted applications and allocate rooms based on
          preferences and priority categories.
        </p>

        <button
          onClick={handleRunAllocation}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Running...' : 'Run Allocation'}
        </button>
      </div>

      {result && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Allocation Results</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{result.allocated}</div>
              <div className="text-sm text-gray-600 mt-1">Allocated</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{result.waitlisted}</div>
              <div className="text-sm text-gray-600 mt-1">Waitlisted</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{result.errors}</div>
              <div className="text-sm text-gray-600 mt-1">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationControl;

