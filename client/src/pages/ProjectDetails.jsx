import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

const ProjectDetails = () => {
  const { id } = useParams();
  const { data: project, loading } = useFetch(`/projects/${id}`);

  if (loading) return <Loader />;

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Project not found</h2>
          <Link to="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 pb-12 pt-24">
        <div className="container-custom">
          <Link
            to="/"
            className="text-primary mb-8 inline-flex items-center gap-2 hover:underline"
          >
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <img
              src={project.image || 'https://via.placeholder.com/1200x600'}
              alt={project.title}
              className="h-96 w-full object-cover"
            />

            <div className="p-8">
              <div className="mb-4 flex items-center gap-4">
                <span className="bg-primary rounded-full px-4 py-1 text-sm font-semibold text-white">
                  {project.category}
                </span>
                <span className="text-gray-500">{project.status}</span>
              </div>

              <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>

              <p className="mb-6 text-lg text-gray-700">{project.description}</p>

              <div className="mb-8 flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center gap-2"
                  >
                    <FaGithub /> View Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4 text-xl font-bold">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="text-primary rounded-lg bg-blue-100 px-4 py-2 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;