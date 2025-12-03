import { Routes, Route } from 'react-router-dom';
import PendingApplications from './PendingApplications';
import ManualAssign from './ManualAssign';

const WardenDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={<PendingApplications />} />
        <Route path="/assign" element={<ManualAssign />} />
      </Routes>
    </div>
  );
};

export default WardenDashboard;

