const Experience = require('../models/Experience');

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
exports.getExperiences = async (req, res, next) => {
  try {
    const { current, limit, sort } = req.query;

    // Build query
    let query = {};

    // Filter by current status
    if (current !== undefined) {
      query.current = current === 'true';
    }

    // Build the find query
    let experiencesQuery = Experience.find(query);

    // Sorting
    if (sort === 'newest') {
      experiencesQuery = experiencesQuery.sort({ startDate: -1 });
    } else if (sort === 'oldest') {
      experiencesQuery = experiencesQuery.sort({ startDate: 1 });
    } else {
      // Default sort by order and then by startDate (newest first)
      experiencesQuery = experiencesQuery.sort({ order: 1, startDate: -1 });
    }

    // Limit results
    if (limit) {
      experiencesQuery = experiencesQuery.limit(parseInt(limit));
    }

    const experiences = await experiencesQuery;

    res.json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single experience
// @route   GET /api/experience/:id
// @access  Public
exports.getExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new experience
// @route   POST /api/experience
// @access  Private/Admin
exports.createExperience = async (req, res, next) => {
  try {
    const {
      company,
      position,
      description,
      startDate,
      endDate,
      current,
      location,
      technologies,
      order,
    } = req.body;

    // Validate required fields
    if (!company || !position || !description || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company, position, description, and start date',
      });
    }

    // If current is true, endDate should be null
    const experienceData = {
      company,
      position,
      description,
      startDate,
      endDate: current ? null : endDate,
      current: current || false,
      location,
      technologies,
      order: order || 0,
    };

    const experience = await Experience.create(experienceData);

    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private/Admin
exports.updateExperience = async (req, res, next) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    // If current is set to true, clear endDate
    if (req.body.current === true) {
      req.body.endDate = null;
    }

    // Update experience
    experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private/Admin
exports.deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    await experience.deleteOne();

    res.json({
      success: true,
      message: 'Experience deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get experiences statistics
// @route   GET /api/experience/stats/summary
// @access  Public
exports.getExperienceStats = async (req, res, next) => {
  try {
    const totalExperiences = await Experience.countDocuments();
    const currentExperiences = await Experience.countDocuments({ current: true });
    const pastExperiences = totalExperiences - currentExperiences;

    // Get all experiences to calculate total years
    const experiences = await Experience.find();
    
    let totalMonths = 0;
    experiences.forEach(exp => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += months;
    });

    const totalYears = (totalMonths / 12).toFixed(1);

    // Get unique technologies
    const allTechnologies = experiences.reduce((acc, exp) => {
      if (exp.technologies) {
        return [...acc, ...exp.technologies];
      }
      return acc;
    }, []);
    const uniqueTechnologies = [...new Set(allTechnologies)];

    res.json({
      success: true,
      data: {
        totalExperiences,
        currentExperiences,
        pastExperiences,
        totalYearsOfExperience: parseFloat(totalYears),
        totalTechnologies: uniqueTechnologies.length,
        technologies: uniqueTechnologies,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder experiences
// @route   PUT /api/experience/reorder
// @access  Private/Admin
exports.reorderExperiences = async (req, res, next) => {
  try {
    const { experiences } = req.body;

    if (!experiences || !Array.isArray(experiences)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of experiences with id and order',
      });
    }

    // Update each experience's order
    const updatePromises = experiences.map(exp =>
      Experience.findByIdAndUpdate(
        exp.id,
        { order: exp.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Fetch updated experiences
    const updatedExperiences = await Experience.find().sort({ order: 1, startDate: -1 });

    res.json({
      success: true,
      message: 'Experiences reordered successfully',
      data: updatedExperiences,
    });
  } catch (error) {
    next(error);
  }
};