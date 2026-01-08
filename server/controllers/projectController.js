const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured, limit, sort, search } = req.query;

    // Build query
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured status
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Search by title, description, or technologies
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Build the find query
    let projectsQuery = Project.find(query);

    // Sorting
    if (sort === 'newest') {
      projectsQuery = projectsQuery.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      projectsQuery = projectsQuery.sort({ createdAt: 1 });
    } else if (sort === 'title') {
      projectsQuery = projectsQuery.sort({ title: 1 });
    } else {
      // Default: sort by order, then newest
      projectsQuery = projectsQuery.sort({ order: 1, createdAt: -1 });
    }

    // Limit results
    if (limit) {
      projectsQuery = projectsQuery.limit(parseInt(limit));
    }

    const projects = await projectsQuery;

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(query);

    res.json({
      success: true,
      count: projects.length,
      total: totalProjects,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      shortDescription,
      image,
      technologies,
      liveUrl,
      githubUrl,
      category,
      featured,
      order,
    } = req.body;

    // Validate required fields
    if (!title || !description || !shortDescription || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, short description, and image',
      });
    }

    // Validate technologies array
    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one technology',
      });
    }

    const project = await Project.create({
      title,
      description,
      shortDescription,
      image,
      technologies,
      liveUrl,
      githubUrl,
      category: category || 'web',
      featured: featured || false,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured/list
// @access  Public
exports.getFeaturedProjects = async (req, res, next) => {
  try {
    const { limit } = req.query;

    let query = Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const projects = await query;

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
exports.getProjectsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit } = req.query;

    let query = Project.find({ category }).sort({ order: 1, createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const projects = await query;

    res.json({
      success: true,
      count: projects.length,
      category,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PUT /api/projects/:id/toggle-featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      success: true,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder projects
// @route   PUT /api/projects/reorder
// @access  Private/Admin
exports.reorderProjects = async (req, res, next) => {
  try {
    const { projects } = req.body;

    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of projects with id and order',
      });
    }

    // Update each project's order
    const updatePromises = projects.map(proj =>
      Project.findByIdAndUpdate(
        proj.id,
        { order: proj.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Fetch updated projects
    const updatedProjects = await Project.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      message: 'Projects reordered successfully',
      data: updatedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats/summary
// @access  Public
exports.getProjectStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    const featuredProjects = await Project.countDocuments({ featured: true });

    // Count by category
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get all unique technologies
    const projects = await Project.find();
    const allTechnologies = projects.reduce((acc, project) => {
      return [...acc, ...project.technologies];
    }, []);
    const uniqueTechnologies = [...new Set(allTechnologies)];

    // Count technology usage
    const technologyCount = {};
    allTechnologies.forEach(tech => {
      technologyCount[tech] = (technologyCount[tech] || 0) + 1;
    });

    // Sort technologies by usage
    const topTechnologies = Object.entries(technologyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        categories: categoryStats,
        totalTechnologies: uniqueTechnologies.length,
        topTechnologies,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete multiple projects
// @route   DELETE /api/projects/bulk/delete
// @access  Private/Admin
exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of project IDs',
      });
    }

    const result = await Project.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} project(s) deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};