const HeroSlide = require('../model/HeroSlide');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Get all hero slides
 * @route   GET /api/hero
 * @access  Public
 */
exports.getAllSlides = asyncHandler(async (req, res) => {
  const slides = await HeroSlide.findAll();
  
  res.json({
    success: true,
    data: slides
  });
});

/**
 * @desc    Get active hero slides (for frontend)
 * @route   GET /api/hero/active
 * @access  Public
 */
exports.getActiveSlides = asyncHandler(async (req, res) => {
  const slides = await HeroSlide.findActive();
  
  res.json({
    success: true,
    data: slides
  });
});

/**
 * @desc    Get single hero slide
 * @route   GET /api/hero/:id
 * @access  Public
 */
exports.getSlideById = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  
  if (!slide) {
    return res.status(404).json({
      success: false,
      message: 'Slide not found'
    });
  }
  
  res.json({
    success: true,
    data: slide
  });
});

/**
 * @desc    Create hero slide
 * @route   POST /api/hero
 * @access  Protected
 */
exports.createSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Slide created successfully',
    data: slide
  });
});

/**
 * @desc    Update hero slide
 * @route   PUT /api/hero/:id
 * @access  Protected
 */
exports.updateSlide = asyncHandler(async (req, res) => {
  const existing = await HeroSlide.findById(req.params.id);
  
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Slide not found'
    });
  }
  
  const slide = await HeroSlide.update(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Slide updated successfully',
    data: slide
  });
});

/**
 * @desc    Delete hero slide
 * @route   DELETE /api/hero/:id
 * @access  Protected
 */
exports.deleteSlide = asyncHandler(async (req, res) => {
  const deleted = await HeroSlide.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Slide not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Slide deleted successfully'
  });
});
