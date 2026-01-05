const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Please add a short description'],
      maxlength: 200,
    },
    image: {
      type: String,
      required: [true, 'Please add an image'],
    },
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['Web App', 'Mobile App', 'Full Stack', 'Frontend', 'Backend', 'Other'],
    },
    liveUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'archived'],
      default: 'completed',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);