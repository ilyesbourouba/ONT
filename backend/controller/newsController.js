const News = require('../model/News');
const { asyncHandler, paginate, paginationResponse } = require('../utils/helpers');

/**
 * @desc    Get all news articles
 * @route   GET /api/news
 * @access  Public
 */
exports.getAllNews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const { offset, limit: lim } = paginate(page, limit);
  
  let articles;
  let total;
  
  if (category && category !== 'All') {
    articles = await News.findByCategory(category, lim, offset);
    total = articles.length;
  } else {
    articles = await News.findAll(lim, offset);
    total = await News.count();
  }
  
  res.json({
    success: true,
    ...paginationResponse(articles, total, page, lim)
  });
});

/**
 * @desc    Get single news article
 * @route   GET /api/news/:id
 * @access  Public
 */
exports.getNewsById = asyncHandler(async (req, res) => {
  const article = await News.findById(req.params.id);
  
  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article not found'
    });
  }
  
  res.json({
    success: true,
    data: article
  });
});

/**
 * @desc    Create news article
 * @route   POST /api/news
 * @access  Protected
 */
exports.createNews = asyncHandler(async (req, res) => {
  const article = await News.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Article created successfully',
    data: article
  });
});

/**
 * @desc    Update news article
 * @route   PUT /api/news/:id
 * @access  Protected
 */
exports.updateNews = asyncHandler(async (req, res) => {
  const existing = await News.findById(req.params.id);
  
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Article not found'
    });
  }
  
  const article = await News.update(req.params.id, req.body);
  
  res.json({
    success: true,
    message: 'Article updated successfully',
    data: article
  });
});

/**
 * @desc    Delete news article
 * @route   DELETE /api/news/:id
 * @access  Protected
 */
exports.deleteNews = asyncHandler(async (req, res) => {
  const deleted = await News.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Article not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Article deleted successfully'
  });
});

/**
 * @desc    Like news article
 * @route   POST /api/news/:id/like
 * @access  Public
 */
exports.likeNews = asyncHandler(async (req, res) => {
  const article = await News.incrementLikes(req.params.id);
  
  if (!article) {
    return res.status(404).json({
      success: false,
      message: 'Article not found'
    });
  }
  
  res.json({
    success: true,
    data: { likes: article.likes }
  });
});
