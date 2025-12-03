import { Routes, Route } from 'react-router-dom';
import ApplicationStatus from './ApplicationStatus';
import ApplyForm from './ApplyForm';
import MyAllocation from './MyAllocation';

const StudentDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={<ApplicationStatus />} />
        <Route path="/apply" element={<ApplyForm />} />
        <Route path="/allocation" element={<MyAllocation />} />
      </Routes>
    </div>
  );
};

export default StudentDashboard;

