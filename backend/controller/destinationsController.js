const Destination = require('../model/Destination');
const { asyncHandler } = require('../utils/helpers');

exports.getAllDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.findAll();
  
  res.json({
    success: true,
    data: destinations
  });
});

exports.getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  res.json({
    success: true,
    data: destination
  });
});

exports.createDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Destination created successfully',
    data: destination
  });
});

exports.updateDestination = asyncHandler(async (req, res) => {
  const existing = await Destination.findById(req.params.id);
  
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  const destination = await Destination.update(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Destination updated successfully',
    data: destination
  });
});

exports.deleteDestination = asyncHandler(async (req, res) => {
  const deleted = await Destination.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Destination deleted successfully'
  });
});
