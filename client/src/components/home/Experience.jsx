import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaGraduationCap, FaProjectDiagram } from 'react-icons/fa';
import axios from '../../utils/api';
import { motion } from 'framer-motion';

// Demo data
const demoData = [
  {
    _id: 'demo1',
    category: 'work',
    title: 'Full Stack Developer',
    company: 'Tech Corp',
    duration: 'Jan 2023 – Present',
    description:
      'Built full-stack MERN apps, integrated REST APIs, optimized performance, deployed on Vercel/Render.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    featured: true,
    location: 'Remote',
    startDate: '2023-01-01',
  },
  {
    _id: 'demo2',
    category: 'education',
    title: 'B.Sc in Computer Science',
    institution: 'National University',
    duration: '2019 – 2023',
    description:
      'Graduated with honors, active in coding clubs and hackathons.',
    technologies: ['JavaScript', 'React', 'Node.js'],
    featured: false,
    location: 'Dhaka, Bangladesh',
    startDate: '2019-01-01',
  },
  {
    _id: 'demo3',
    category: 'project',
    title: 'Portfolio Website',
    company: 'Personal',
    duration: '2022',
    description: 'Built portfolio using MERN stack and Tailwind CSS with animations.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    featured: true,
    location: 'Remote',
    startDate: '2022-06-01',
  },
];

const Experience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = async () => {
    try {
      const res = await axios.get('/experience');
      const merged = [...demoData, ...res.data];
      const sorted = merged.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      setItems(sorted);
    } catch (err) {
      console.error('Failed to fetch experience:', err);
      setItems(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work':
        return <FaBriefcase className="h-5 w-5 text-white" />;
      case 'education':
        return <FaGraduationCap className="h-5 w-5 text-white" />;
      case 'project':
        return <FaProjectDiagram className="h-5 w-5 text-white" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work':
        return 'bg-red-600';
      case 'education':
        return 'bg-blue-600';
      case 'project':
        return 'bg-green-600';
      default:
        return 'bg-gray-400';
    }
  };

  if (loading) return <p className="py-16 text-center text-gray-700">Loading...</p>;

  return (
    <section className="bg-white px-4 py-16 md:px-12" id="experience">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-red-600">
          Timeline & Achievements
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative rounded-xl border-l-8 border-gray-200 p-6 shadow-lg transition duration-300 hover:shadow-2xl"
            >
              {/* Icon circle */}
              <div
                className={`absolute -left-8 top-6 w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(
                  item.category
                )}`}
              >
                {getCategoryIcon(item.category)}
              </div>

              {/* Card content */}
              <div className="ml-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  {item.featured && (
                    <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-600">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 italic text-gray-700">
                  {item.institution || item.company} | {item.duration}
                  {item.location && ` | ${item.location}`}
                </p>
                <p className="mt-3 text-gray-800">{item.description}</p>

                {item.technologies && item.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded border border-red-600 px-2 py-1 text-sm text-red-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
