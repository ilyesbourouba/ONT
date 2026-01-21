const VirtualTour = require('../model/VirtualTour');
const { asyncHandler } = require('../utils/helpers');

exports.getAllTours = asyncHandler(async (req, res) => {
  const tours = await VirtualTour.findAll();
  
  res.json({
    success: true,
    data: tours
  });
});

exports.getTourById = asyncHandler(async (req, res) => {
  const tour = await VirtualTour.findById(req.params.id);
  
  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Virtual tour not found'
    });
  }
  
  res.json({
    success: true,
    data: tour
  });
});

exports.createTour = asyncHandler(async (req, res) => {
  const tour = await VirtualTour.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Virtual tour created successfully',
    data: tour
  });
});

exports.updateTour = asyncHandler(async (req, res) => {
  const existing = await VirtualTour.findById(req.params.id);
  
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Virtual tour not found'
    });
  }
  
  const tour = await VirtualTour.update(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Virtual tour updated successfully',
    data: tour
  });
});

exports.deleteTour = asyncHandler(async (req, res) => {
  const deleted = await VirtualTour.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Virtual tour not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Virtual tour deleted successfully'
  });
});
