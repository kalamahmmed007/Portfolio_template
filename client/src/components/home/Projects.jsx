import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../common/Loader";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";

const Projects = () => {
  const { data: projects, loading } = useFetch("/projects");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  if (loading) return <Loader />;

  // Fixed featured projects (3 always)
  const fixedProjects = projects
    ?.filter(p => p.featured)
    .slice(0, 3);

  // Filtered projects (for the rest)
  let filteredProjects = projects?.filter(p => !fixedProjects.includes(p));

  if (categoryFilter !== "All") {
    filteredProjects = filteredProjects?.filter(p => p.category === categoryFilter);
  }

  if (featuredOnly) {
    filteredProjects = filteredProjects?.filter(p => p.featured);
  }

  // Get all categories for filter buttons
  const categories = ["All", ...new Set(projects?.map(p => p.category))];

  return (
    <section id="projects" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Projects <span className="text-red-600">Portfolio</span>
          </h2>
          <p className="mt-4 text-gray-600">
            My featured and latest work 🚀
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg border ${
                categoryFilter === cat
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600"
              } transition-all duration-300`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setFeaturedOnly(prev => !prev)}
            className={`px-4 py-2 rounded-lg border ${
              featuredOnly
                ? "bg-red-600 text-white border-red-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-600"
            } transition-all duration-300`}
          >
            {featuredOnly ? "Featured Only ⭐" : "Show All"}
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {/* Fixed Featured Projects */}
          {fixedProjects?.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-red-500 hover:shadow-xl"
            >
              {/* Featured Badge */}
              <span className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                <FaStar /> Featured
              </span>

              {/* Image */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={project.image || "https://via.placeholder.com/400x300"}
                  alt={project.title}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/0 transition group-hover:bg-black/50">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <FaGithub />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-sm font-semibold text-red-600">
                  {project.category}
                </span>

                <h3 className="mb-2 mt-2 text-xl font-bold text-gray-900">
                  {project.title}
                </h3>

                <p className="mb-4 text-sm text-gray-600">
                  {project.shortDescription}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  to={project.link || "#"}
                  className="font-semibold text-red-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}

          {/* Filtered / Non-fixed Projects */}
          {filteredProjects?.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-red-500 hover:shadow-xl"
            >
              {project.featured && (
                <span className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  <FaStar /> Featured
                </span>
              )}

              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={project.image || "https://via.placeholder.com/400x300"}
                  alt={project.title}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-5 bg-black/0 transition group-hover:bg-black/50">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <FaGithub />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6">
                <span className="text-sm font-semibold text-red-600">
                  {project.category}
                </span>

                <h3 className="mb-2 mt-2 text-xl font-bold text-gray-900">
                  {project.title}
                </h3>

                <p className="mb-4 text-sm text-gray-600">
                  {project.shortDescription}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  to={project.link || "#"}
                  className="font-semibold text-red-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Projects;
