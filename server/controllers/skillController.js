const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const { category, limit, sort, search, minProficiency } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by minimum proficiency
    if (minProficiency) {
      query.proficiency = { $gte: parseInt(minProficiency) };
    }

    // Search by skill name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Build the find query
    let skillsQuery = Skill.find(query);

    // Sorting
    if (sort === 'proficiency-high') {
      skillsQuery = skillsQuery.sort({ proficiency: -1 });
    } else if (sort === 'proficiency-low') {
      skillsQuery = skillsQuery.sort({ proficiency: 1 });
    } else if (sort === 'name') {
      skillsQuery = skillsQuery.sort({ name: 1 });
    } else {
      // Default: sort by order, then by name
      skillsQuery = skillsQuery.sort({ order: 1, name: 1 });
    }

    // Limit results
    if (limit) {
      skillsQuery = skillsQuery.limit(parseInt(limit));
    }

    const skills = await skillsQuery;

    // Get total count
    const totalSkills = await Skill.countDocuments(query);

    res.json({
      success: true,
      count: skills.length,
      total: totalSkills,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
exports.createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency, icon, order } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name and category',
      });
    }

    // Validate proficiency range
    if (proficiency && (proficiency < 0 || proficiency > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Proficiency must be between 0 and 100',
      });
    }

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'Skill with this name already exists',
      });
    }

    const skill = await Skill.create({
      name,
      category,
      proficiency: proficiency || 50,
      icon: icon || '',
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
exports.updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    // Validate proficiency if provided
    if (req.body.proficiency && (req.body.proficiency < 0 || req.body.proficiency > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Proficiency must be between 0 and 100',
      });
    }

    // Check if updating name to one that already exists
    if (req.body.name) {
      const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Skill with this name already exists',
        });
      }
    }

    // Update skill
    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    await skill.deleteOne();

    res.json({
      success: true,
      message: 'Skill deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
exports.getSkillsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit } = req.query;

    let query = Skill.find({ category }).sort({ order: 1, name: 1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const skills = await query;

    res.json({
      success: true,
      count: skills.length,
      category,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills grouped by category
// @route   GET /api/skills/grouped/all
// @access  Public
exports.getSkillsGrouped = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });

    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      count: skills.length,
      data: grouped,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill proficiency
// @route   PUT /api/skills/:id/proficiency
// @access  Private/Admin
exports.updateProficiency = async (req, res, next) => {
  try {
    const { proficiency } = req.body;

    if (!proficiency || proficiency < 0 || proficiency > 100) {
      return res.status(400).json({
        success: false,
        message: 'Proficiency must be between 0 and 100',
      });
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    skill.proficiency = proficiency;
    await skill.save();

    res.json({
      success: true,
      message: 'Proficiency updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder skills
// @route   PUT /api/skills/reorder
// @access  Private/Admin
exports.reorderSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of skills with id and order',
      });
    }

    // Update each skill's order
    const updatePromises = skills.map(skill =>
      Skill.findByIdAndUpdate(
        skill.id,
        { order: skill.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Fetch updated skills
    const updatedSkills = await Skill.find().sort({ order: 1, name: 1 });

    res.json({
      success: true,
      message: 'Skills reordered successfully',
      data: updatedSkills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill statistics
// @route   GET /api/skills/stats/summary
// @access  Public
exports.getSkillStats = async (req, res, next) => {
  try {
    const totalSkills = await Skill.countDocuments();

    // Count by category
    const categoryStats = await Skill.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgProficiency: { $avg: '$proficiency' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get overall average proficiency
    const avgProficiencyResult = await Skill.aggregate([
      {
        $group: {
          _id: null,
          avgProficiency: { $avg: '$proficiency' },
        },
      },
    ]);

    const avgProficiency = avgProficiencyResult.length > 0 
      ? avgProficiencyResult[0].avgProficiency.toFixed(1) 
      : 0;

    // Get top skills
    const topSkills = await Skill.find()
      .sort({ proficiency: -1 })
      .limit(5)
      .select('name proficiency category');

    res.json({
      success: true,
      data: {
        totalSkills,
        avgProficiency: parseFloat(avgProficiency),
        categories: categoryStats,
        topSkills,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete multiple skills
// @route   DELETE /api/skills/bulk/delete
// @access  Private/Admin
exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of skill IDs',
      });
    }

    const result = await Skill.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} skill(s) deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};