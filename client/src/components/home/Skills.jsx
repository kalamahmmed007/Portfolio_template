import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaLock,
  FaGitAlt,
  FaTools,
  FaRocket,
} from "react-icons/fa";
import { Loader } from "lucide-react";

/* 🔒 FIXED CORE SKILLS (always visible) */
const fixedSkills = [
  {
    title: "Core Web",
    icon: <FaHtml5 className="text-red-600" />,
    items: [
      "HTML5 (Semantic tags, Accessibility)",
      "CSS3 (Flexbox, Grid)",
      "JavaScript (ES6+)",
      "Closures, async/await",
      "Array methods (map, filter, reduce)",
      "Error handling",
    ],
  },
  {
    title: "Frontend (React)",
    icon: <FaReact className="text-sky-500" />,
    items: [
      "React",
      "Hooks (useState, useEffect, useContext, useRef)",
      "Component lifecycle",
      "Controlled forms",
      "React Router",
      "State Management",
      "Context API",
      "Redux Toolkit / Zustand",
      "Tailwind CSS",
      "ShadCN / MUI / AntD",
      "Performance (lazy loading, memo, useCallback)",
    ],
  },
  {
    title: "Backend (Node & Express)",
    icon: <FaNodeJs className="text-green-600" />,
    items: [
      "Node.js",
      "Express.js",
      "MVC architecture",
      "Middleware",
      "REST API",
      "CRUD",
      "Pagination, filtering, sorting",
      "Authentication",
      "JWT & Refresh Tokens",
      "Role-based access (admin/user)",
    ],
  },
  {
    title: "Database (MongoDB)",
    icon: <FaDatabase className="text-emerald-600" />,
    items: [
      "MongoDB",
      "Mongoose",
      "Schema design",
      "Relations (populate)",
      "Indexes & performance",
      "Aggregation pipeline (basic)",
    ],
  },
  {
    title: "Security",
    icon: <FaLock className="text-red-500" />,
    items: [
      "Password hashing (bcrypt)",
      "CORS",
      "Rate limiting",
      "Input validation (Joi / Zod / express-validator)",
      "Environment variables (.env)",
    ],
  },
  {
    title: "Tools & Workflow",
    icon: <FaGitAlt className="text-orange-500" />,
    items: [
      "Git & GitHub",
      "Branch, PR, commit messages",
      "npm / yarn / pnpm",
      "ESLint + Prettier",
      "Vite / Webpack",
      "Postman / Thunder Client",
      "Debugging Node & React",
      "Basic unit testing (Jest)",
    ],
  },
  {
    title: "Deployment & DevOps",
    icon: <FaRocket className="text-purple-600" />,
    items: [
      "Vercel / Netlify",
      "Render / Railway",
      "MongoDB Atlas",
      "Nginx (basic)",
      "Domain & SSL",
    ],
  },
  {
    title: "Extra Skills",
    icon: <FaTools className="text-gray-700" />,
    items: [
      "Stripe payment integration",
      "File upload (Multer + Cloudinary)",
      "Email (Nodemailer)",
      "Socket.io (real-time)",
      "Admin dashboard",
      "Swagger API docs",
      "Full e-commerce",
      "Blog / CMS",
      "Real-time chat app",
    ],
  },
];

const Skills = () => {
  const [adminSkills, setAdminSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get("/skills");
        setAdminSkills(data);
      } catch (err) {
        console.error("Failed to load admin skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Skills & <span className="text-red-600">Tech Stack</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Tools, technologies and practices I use to build secure,
            scalable and production-ready applications.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...fixedSkills, ...adminSkills].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-gray-200 p-6 transition-all hover:border-red-500 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center space-x-3">
                  <div className="text-2xl">{skill.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {skill.title}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {skill.items.map((item, idx) => (
                    <li key={idx} className="flex text-gray-700">
                      <span className="mr-3 mt-2 h-2 w-2 rounded-full bg-red-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
