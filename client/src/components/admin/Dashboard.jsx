import { useFetch } from '../../hooks/useFetch';
import Loader from '../common/Loader';
import { FaProjectDiagram, FaTools, FaEnvelope, FaBriefcase } from 'react-icons/fa';

const Dashboard = () => {
  const { data: projects, loading: projectsLoading } = useFetch('/projects');
  const { data: skills, loading: skillsLoading } = useFetch('/skills');
  const { data: messages, loading: messagesLoading } = useFetch('/messages');
  const { data: experience, loading: experienceLoading } = useFetch('/experience');

  if (projectsLoading || skillsLoading || messagesLoading || experienceLoading) {
    return <Loader />;
  }

  const unreadMessages = messages?.filter((m) => !m.read).length || 0;

  const stats = [
    {
      icon: <FaProjectDiagram />,
      label: 'Total Projects',
      value: projects?.length || 0,
      color: 'bg-blue-500',
    },
    {
      icon: <FaTools />,
      label: 'Total Skills',
      value: skills?.length || 0,
      color: 'bg-green-500',
    },
    {
      icon: <FaEnvelope />,
      label: 'Unread Messages',
      value: unreadMessages,
      color: 'bg-red-500',
    },
    {
      icon: <FaBriefcase />,
      label: 'Work Experience',
      value: experience?.length || 0,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} text-white p-4 rounded-lg text-3xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-xl font-bold">Recent Projects</h2>
          <div className="space-y-3">
            {projects?.slice(0, 5).map((project) => (
              <div key={project._id} className="flex items-center justify-between border-b py-2">
                <span className="font-medium">{project.title}</span>
                <span className="text-sm text-gray-500">{project.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-xl font-bold">Recent Messages</h2>
          <div className="space-y-3">
            {messages?.slice(0, 5).map((message) => (
              <div key={message._id} className="border-b py-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                  </div>
                  {!message.read && (
                    <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;