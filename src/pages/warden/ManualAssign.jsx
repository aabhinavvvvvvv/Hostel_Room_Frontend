import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManualAssign = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedBed, setSelectedBed] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchStudents();
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      if (response.data.success) {
        setApplicationData(response.data.data);
        setSelectedStudent(response.data.data.studentId);
      }
    } catch (error) {
      console.error('Failed to load application:', error);
      toast.error('Failed to load application details');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load rooms');
    }
  };

  const fetchStudents = async () => {
    try {
      // Fetch all students from users endpoint
      const response = await api.get('/users?role=STUDENT');
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Failed to load students');
    }
  };

  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);
  const availableBeds = selectedRoomData
    ? selectedRoomData.beds.filter((bed) => !bed.occupiedBy)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !selectedBed || !selectedStudent) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/rooms/${selectedRoom}/assign`, {
        studentId: selectedStudent,
        bedNumber: parseInt(selectedBed),
      });

      if (response.data.success) {
        toast.success('Student assigned successfully');
        navigate('/warden');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign student';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manual Assignment</h1>

      {applicationData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Application Details</h3>
          <p className="text-sm text-blue-800">
            <strong>Student:</strong> {applicationData.student.name} ({applicationData.student.email})
          </p>
          <p className="text-sm text-blue-800">
            <strong>Status:</strong> {applicationData.status}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-2">
            Student {applicationId && '(from application)'}
          </label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={!!applicationId}
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
            Room
          </label>
          <select
            id="room"
            value={selectedRoom}
            onChange={(e) => {
              setSelectedRoom(e.target.value);
              setSelectedBed('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.block.name} - Room {room.number} ({room.beds.filter((b) => !b.occupiedBy).length} available)
              </option>
            ))}
          </select>
        </div>

        {selectedRoom && (
          <div>
            <label htmlFor="bed" className="block text-sm font-medium text-gray-700 mb-2">
              Bed
            </label>
            {availableBeds.length === 0 ? (
              <p className="text-red-600">No available beds in this room</p>
            ) : (
              <select
                id="bed"
                value={selectedBed}
                onChange={(e) => setSelectedBed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a bed</option>
                {availableBeds.map((bed) => (
                  <option key={bed.id} value={bed.bedNumber}>
                    Bed {bed.bedNumber}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/warden')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || availableBeds.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualAssign;

