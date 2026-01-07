import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Button from '../common/Button';
import { PROJECT_CATEGORIES } from '../../utils/constants';

const ProjectForm = ({ project, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    shortDescription: project?.shortDescription || '',
    category: project?.category || PROJECT_CATEGORIES[0],
    technologies: project?.technologies?.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    image: project?.image || '',
    featured: project?.featured || false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()),
    };

    try {
      if (project) {
        await api.put(`/projects/${project._id}`, data);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', data);
        toast.success('Project created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block font-medium text-gray-700">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">Short Description *</label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          maxLength="200"
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        ></textarea>
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        >
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">
          Technologies (comma-separated) *
        </label>
        <input
          type="text"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          required
          placeholder="React, Node.js, MongoDB"
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">Image URL *</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="https://example.com/image.jpg"
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">Live URL</label>
        <input
          type="url"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleChange}
          placeholder="https://example.com"
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">GitHub URL</label>
        <input
          type="url"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/username/repo"
          className="focus:border-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="text-primary h-4 w-4"
        />
        <label className="ml-2 text-gray-700">Featured Project</label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
};

export default ProjectForm;