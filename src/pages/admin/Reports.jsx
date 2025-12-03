import api from '../../utils/api';
import toast from 'react-hot-toast';

const Reports = () => {
  const handleDownload = async (type) => {
    try {
      const response = await api.get(`/reports/${type}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="space-y-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Occupancy Report</h2>
          <p className="text-gray-600 mb-4">
            Download a CSV report of all room allocations and occupancy details.
          </p>
          <button
            onClick={() => handleDownload('occupancy')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download Occupancy Report
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Applications Report</h2>
          <p className="text-gray-600 mb-4">
            Download a CSV report of all applications with their status and details.
          </p>
          <button
            onClick={() => handleDownload('applications')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download Applications Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;

