import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Hostel Room System
            </Link>
            {user && (
              <div className="ml-10 flex space-x-4">
                {user.role === 'STUDENT' && (
                  <>
                    <Link to="/student" className="px-3 py-2 rounded-md hover:bg-blue-700">
                      Dashboard
                    </Link>
                    <Link to="/student/apply" className="px-3 py-2 rounded-md hover:bg-blue-700">
                      Apply
                    </Link>
                  </>
                )}
                {(user.role === 'WARDEN' || user.role === 'ADMIN') && (
                  <>
                    <Link to="/warden" className="px-3 py-2 rounded-md hover:bg-blue-700">
                      Warden Dashboard
                    </Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-blue-700">
                      Admin Console
                    </Link>
                    <Link to="/admin/users" className="px-3 py-2 rounded-md hover:bg-blue-700">
                      Users
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-md hover:bg-blue-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

