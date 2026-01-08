import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../common/Loader";

import { 
  Briefcase, 
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  Award,
  Users,
  Target,
  TrendingUp,
  Code,
  Lightbulb,
  Rocket,
  GraduationCap
} from 'lucide-react';

const Experience = () => {
  const [activeTab, setActiveTab] = useState("work");

  // Stats
  const stats = [
    { value: "1+", label: "Years Experience", icon: Briefcase },
    { value: "50+", label: "Projects Delivered", icon: Rocket },
    { value: "30+", label: "Happy Clients", icon: Users },
    { value: "15+", label: "Technologies", icon: Code },
  ];

  // Tabs
  const tabs = [
    { id: "work", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "achievements", label: "Achievements", icon: Award },
  ];

  // Demo Work Experience (1 sample)
  const workExperience = [
    {
      id: 1,
      position: "Full Stack Developer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      type: "Full-time",
      duration: "Jan 2023 - Present",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      logo: "💼",
      website: "https://techsolutions.com",
      description: "Built and maintained scalable web applications using the MERN stack.",
      responsibilities: [
        "Developed full-stack features using React, Node.js, and MongoDB",
        "Implemented CI/CD pipelines for faster deployment",
        "Collaborated with design and QA teams to deliver high-quality software"
      ],
      technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
      achievements: [
        "Launched 3 major projects successfully",
        "Reduced bug reports by 40% through unit testing"
      ]
    },
  ];

  // Demo Education
  const education = [
    {
      id: 1,
      degree: "B.Sc. in Computer Science",
      institution: "University of Dhaka",
      location: "Dhaka, Bangladesh",
      duration: "2017 - 2021",
      grade: "CGPA: 3.75/4.00",
      logo: "🎓",
      description: "Studied software engineering, data structures, algorithms, and web technologies.",
      courses: ["Data Structures", "Web Development", "Database Systems"],
      achievements: ["Dean's List", "University programming club leader"]
    },
  ];

  // Demo Achievements
  const achievements = [
    {
      id: 1,
      icon: Award,
      title: "Best Developer Award",
      organization: "Tech Solutions Inc.",
      date: "Dec 2024",
      description: "Recognized for outstanding performance and contributions.",
      color: "from-yellow-500 to-yellow-700"
    },
  ];

  const renderWorkExperience = () => (
    <div className="space-y-8">
      {workExperience.map((job, index) => (
        <div key={job.id} className="border rounded-xl p-6 bg-white shadow hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-lg text-2xl">{job.logo}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{job.position}</h3>
              <div className="text-gray-500 text-sm flex flex-wrap gap-2 mb-2">
                <a href={job.website} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 flex items-center gap-1">
                  {job.company} <ExternalLink className="w-3 h-3" />
                </a>
                <span>{job.location}</span>
                <span>{job.type}</span>
              </div>
              <p className="text-gray-700 mb-2">{job.description}</p>
              <h4 className="font-semibold mb-1">Responsibilities:</h4>
              <ul className="list-disc list-inside mb-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="text-gray-700">{r}</li>
                ))}
              </ul>
              <h4 className="font-semibold mb-1">Technologies:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.technologies.map((tech, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">{tech}</span>
                ))}
              </div>
              <h4 className="font-semibold mb-1">Achievements:</h4>
              <ul className="list-disc list-inside">
                {job.achievements.map((a, i) => (
                  <li key={i} className="text-gray-700">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {education.map((edu) => (
        <div key={edu.id} className="border rounded-xl p-6 bg-white shadow hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg text-2xl">{edu.logo}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{edu.degree}</h3>
              <div className="text-gray-500 text-sm flex flex-wrap gap-2 mb-2">
                <span>{edu.institution}</span>
                <span>{edu.location}</span>
              </div>
              <p className="text-gray-700 mb-2">{edu.description}</p>
              <h4 className="font-semibold mb-1">Courses:</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {edu.courses.map((c, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">{c}</span>
                ))}
              </div>
              <h4 className="font-semibold mb-1">Achievements:</h4>
              <ul className="list-disc list-inside">
                {edu.achievements.map((a, i) => (
                  <li key={i} className="text-gray-700">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((ach) => (
        <div key={ach.id} className="border rounded-xl p-6 bg-white shadow hover:shadow-lg transition-all duration-300">
          <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white mb-3`} style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
            <ach.icon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-1">{ach.title}</h3>
          <span className="text-sm text-gray-500">{ach.organization} • {ach.date}</span>
          <p className="text-gray-700 mt-2">{ach.description}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section id="experience" className="relative py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
            <Briefcase className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-700">My Journey</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gray-900">Work </span>
            <span className="text-red-500">Experience</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A timeline of my professional journey, education, and achievements</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="border rounded-xl p-6 text-center bg-gray-50 shadow">
              <stat.icon className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id ? "bg-red-500 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-red-50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === "work" && renderWorkExperience()}
          {activeTab === "education" && renderEducation()}
          {activeTab === "achievements" && renderAchievements()}
        </div>
      </div>
    </section>
  );
};

export default Experience;
