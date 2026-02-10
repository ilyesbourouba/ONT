const UnescoSite = require('../model/UnescoSite');
const { asyncHandler } = require('../utils/helpers');

// ==============================
// PUBLIC - Get All (sites + content)
// ==============================

exports.getAll = asyncHandler(async (req, res) => {
  const data = await UnescoSite.getAll();
  res.json({ success: true, data });
});

// ==============================
// SITES
// ==============================

exports.getAllSites = asyncHandler(async (req, res) => {
  const sites = await UnescoSite.findAll();
  res.json({ success: true, data: sites });
});

exports.getSiteById = asyncHandler(async (req, res) => {
  const site = await UnescoSite.findById(req.params.id);
  if (!site) {
    return res.status(404).json({ success: false, message: 'UNESCO site not found' });
  }
  res.json({ success: true, data: site });
});

exports.createSite = asyncHandler(async (req, res) => {
  const site = await UnescoSite.create(req.body);
  res.status(201).json({ success: true, message: 'UNESCO site created successfully', data: site });
});

exports.updateSite = asyncHandler(async (req, res) => {
  const existing = await UnescoSite.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'UNESCO site not found' });
  }
  const site = await UnescoSite.update(req.params.id, req.body);
  res.json({ success: true, message: 'UNESCO site updated successfully', data: site });
});

exports.deleteSite = asyncHandler(async (req, res) => {
  const deleted = await UnescoSite.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'UNESCO site not found' });
  }
  res.json({ success: true, message: 'UNESCO site deleted successfully' });
});

// ==============================
// CONTENT
// ==============================

exports.getContent = asyncHandler(async (req, res) => {
  const content = await UnescoSite.getContent();
  res.json({ success: true, data: content });
});

exports.updateContent = asyncHandler(async (req, res) => {
  const content = await UnescoSite.updateContent(req.body);
  res.json({ success: true, message: 'Content updated', data: content });
});

