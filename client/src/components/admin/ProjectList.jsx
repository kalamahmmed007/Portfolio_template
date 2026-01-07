import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetch } from '../../hooks/useFetch';
import api from '../../utils/api';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import ProjectForm from './ProjectForm';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ProjectList = () => {
  const { data: projects, loading, refetch } = useFetch('/projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    refetch();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Project
        </button>
      </div>

      <div className="grid gap-6">
        {projects?.map((project) => (
          <div key={project._id} className="card">
            <div className="flex gap-6">
              <img
                src={project.image || 'https://via.placeholder.com/200'}
                alt={project.title}
                className="h-32 w-48 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <span className="text-primary text-sm">{project.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-xl text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-xl text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="mb-2 text-gray-600">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-primary rounded-full bg-blue-100 px-3 py-1 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add Project'}
      >
        <ProjectForm project={editingProject} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default ProjectList;