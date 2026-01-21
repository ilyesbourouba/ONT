const Activity = require('../model/Activity');
const { asyncHandler, paginate, paginationResponse } = require('../utils/helpers');

exports.getAllActivities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { offset, limit: lim } = paginate(page, limit);
  
  const activities = await Activity.findAll(lim, offset);
  const total = await Activity.count();
  
  res.json({
    success: true,
    ...paginationResponse(activities, total, page, lim)
  });
});

exports.getActivityById = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  res.json({
    success: true,
    data: activity
  });
});

exports.createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Activity created successfully',
    data: activity
  });
});

exports.updateActivity = asyncHandler(async (req, res) => {
  const existing = await Activity.findById(req.params.id);
  
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  const activity = await Activity.update(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Activity updated successfully',
    data: activity
  });
});

exports.deleteActivity = asyncHandler(async (req, res) => {
  const deleted = await Activity.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Activity deleted successfully'
  });
});
