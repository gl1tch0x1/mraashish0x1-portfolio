const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Service = require('../models/Service');
const Timeline = require('../models/Timeline');
const Contact = require('../models/Contact');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const [
    totalProjects,
    activeProjects,
    totalSkills,
    totalServices,
    totalTimeline,
    totalContacts,
    unreadContacts,
    totalUsers
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'active' }),
    Skill.countDocuments(),
    Service.countDocuments(),
    Timeline.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'unread' }),
    User.countDocuments()
  ]);
  
  // Get recent contacts
  const recentContacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email subject status createdAt');
  
  // Get recent projects
  const recentProjects = await Project.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status featured createdAt');
  
  // Get featured content counts
  const featuredProjects = await Project.countDocuments({ featured: true });
  const featuredSkills = await Skill.countDocuments({ featured: true });
  
  res.status(200).json({
    success: true,
    data: {
      counts: {
        projects: {
          total: totalProjects,
          active: activeProjects,
          featured: featuredProjects
        },
        skills: {
          total: totalSkills,
          featured: featuredSkills
        },
        services: totalServices,
        timeline: totalTimeline,
        contacts: {
          total: totalContacts,
          unread: unreadContacts
        },
        users: totalUsers
      },
      recent: {
        contacts: recentContacts,
        projects: recentProjects
      }
    }
  });
});

// @desc    Get content summary
// @route   GET /api/dashboard/summary
// @access  Private
exports.getContentSummary = asyncHandler(async (req, res, next) => {
  // Get all content with basic info
  const [projects, skills, services, timeline] = await Promise.all([
    Project.find().select('title status featured createdAt updatedAt').sort({ createdAt: -1 }),
    Skill.find().select('name category level featured createdAt').sort({ category: 1, name: 1 }),
    Service.find().select('title active createdAt').sort({ order: 1 }),
    Timeline.find().select('title type year createdAt').sort({ year: -1, startDate: -1 })
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      projects,
      skills,
      services,
      timeline
    }
  });
});

// @desc    Get activity log
// @route   GET /api/dashboard/activity
// @access  Private
exports.getActivityLog = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;
  
  // Get recent updates from all collections
  const [projects, skills, services, timeline, contacts] = await Promise.all([
    Project.find().select('title updatedAt').sort({ updatedAt: -1 }).limit(5),
    Skill.find().select('name updatedAt').sort({ updatedAt: -1 }).limit(5),
    Service.find().select('title updatedAt').sort({ updatedAt: -1 }).limit(5),
    Timeline.find().select('title updatedAt').sort({ updatedAt: -1 }).limit(5),
    Contact.find().select('name email createdAt').sort({ createdAt: -1 }).limit(5)
  ]);
  
  // Combine and format activity
  const activity = [
    ...projects.map(p => ({ type: 'project', action: 'updated', title: p.title, date: p.updatedAt })),
    ...skills.map(s => ({ type: 'skill', action: 'updated', title: s.name, date: s.updatedAt })),
    ...services.map(s => ({ type: 'service', action: 'updated', title: s.title, date: s.updatedAt })),
    ...timeline.map(t => ({ type: 'timeline', action: 'updated', title: t.title, date: t.updatedAt })),
    ...contacts.map(c => ({ type: 'contact', action: 'received', title: `${c.name} - ${c.email}`, date: c.createdAt }))
  ];
  
  // Sort by date and limit
  activity.sort((a, b) => new Date(b.date) - new Date(a.date));
  const limitedActivity = activity.slice(0, limit);
  
  res.status(200).json({
    success: true,
    count: limitedActivity.length,
    data: limitedActivity
  });
});

// @desc    Bulk operations - Delete multiple items
// @route   POST /api/dashboard/bulk-delete
// @access  Private (Admin only)
exports.bulkDelete = asyncHandler(async (req, res, next) => {
  const { type, ids } = req.body;
  
  if (!type || !ids || !Array.isArray(ids)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide type and ids array'
    });
  }
  
  let Model;
  switch (type) {
    case 'projects':
      Model = Project;
      break;
    case 'skills':
      Model = Skill;
      break;
    case 'services':
      Model = Service;
      break;
    case 'timeline':
      Model = Timeline;
      break;
    case 'contacts':
      Model = Contact;
      break;
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid type'
      });
  }
  
  const result = await Model.deleteMany({ _id: { $in: ids } });
  
  res.status(200).json({
    success: true,
    data: {
      deletedCount: result.deletedCount
    }
  });
});

// @desc    Bulk operations - Update status
// @route   POST /api/dashboard/bulk-update-status
// @access  Private
exports.bulkUpdateStatus = asyncHandler(async (req, res, next) => {
  const { type, ids, status } = req.body;
  
  if (!type || !ids || !Array.isArray(ids) || !status) {
    return res.status(400).json({
      success: false,
      error: 'Please provide type, ids array, and status'
    });
  }
  
  let Model, updateField;
  switch (type) {
    case 'projects':
      Model = Project;
      updateField = 'status';
      break;
    case 'services':
      Model = Service;
      updateField = 'active';
      break;
    case 'contacts':
      Model = Contact;
      updateField = 'status';
      break;
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid type'
      });
  }
  
  const result = await Model.updateMany(
    { _id: { $in: ids } },
    { [updateField]: status }
  );
  
  res.status(200).json({
    success: true,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
});

// @desc    Search across all content
// @route   GET /api/dashboard/search
// @access  Private
exports.searchContent = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a search query'
    });
  }
  
  const searchRegex = new RegExp(q, 'i');
  
  const [projects, skills, services, timeline, contacts] = await Promise.all([
    Project.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { technologies: searchRegex }
      ]
    }).limit(10),
    Skill.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex }
      ]
    }).limit(10),
    Service.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10),
    Timeline.find({
      $or: [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10),
    Contact.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex }
      ]
    }).limit(10)
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      projects,
      skills,
      services,
      timeline,
      contacts
    }
  });
});

