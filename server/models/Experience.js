const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please add company name'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Please add position'],
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add start date'],
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);