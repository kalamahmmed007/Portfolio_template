// constants.js

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  PROJECT_DETAILS: '/project/:id',
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_SKILLS: '/admin/skills',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_EXPERIENCE: '/admin/experience',
};

export const PROJECT_CATEGORIES = [
  'Web App',
  'Mobile App',
  'Full Stack',
  'Frontend',
  'Backend',
  'Other'
];

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'Tools',
  'Other'
];

export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];
