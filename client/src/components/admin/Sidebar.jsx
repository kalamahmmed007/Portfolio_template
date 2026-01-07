import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FaHome,
  FaTachometerAlt,
  FaProjectDiagram,
  FaTools,
  FaEnvelope,
  FaBriefcase,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'View Site' },
    { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: '/admin/skills', icon: <FaTools />, label: 'Skills' },
    { path: '/admin/experience', icon: <FaBriefcase />, label: 'Experience' },
    { path: '/admin/messages', icon: <FaEnvelope />, label: 'Messages' },
  ];

  return (
    <div className="bg-dark min-h-screen w-64 p-6 text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-200 hover:bg-gray-800"
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;