const About = require('../model/About');
const { asyncHandler } = require('../utils/helpers');

// ==============================
// PUBLIC - Get All (for frontend)
// ==============================

exports.getAboutData = asyncHandler(async (req, res) => {
  const data = await About.getAll();
  res.json({ success: true, data });
});

// ==============================
// MAIN CONTENT
// ==============================

exports.getContent = asyncHandler(async (req, res) => {
  const content = await About.getContent();
  res.json({ success: true, data: content });
});

exports.updateContent = asyncHandler(async (req, res) => {
  const content = await About.updateContent(req.body);
  res.json({ success: true, message: 'Content updated', data: content });
});

// ==============================
// MISSIONS
// ==============================

exports.getMissions = asyncHandler(async (req, res) => {
  const missions = await About.getMissions();
  res.json({ success: true, data: missions });
});

exports.createMission = asyncHandler(async (req, res) => {
  const mission = await About.createMission(req.body);
  res.status(201).json({ success: true, message: 'Mission created', data: mission });
});

exports.updateMission = asyncHandler(async (req, res) => {
  const mission = await About.updateMission(req.params.id, req.body);
  if (!mission) {
    return res.status(404).json({ success: false, message: 'Mission not found' });
  }
  res.json({ success: true, message: 'Mission updated', data: mission });
});

exports.deleteMission = asyncHandler(async (req, res) => {
  const deleted = await About.deleteMission(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Mission not found' });
  }
  res.json({ success: true, message: 'Mission deleted' });
});

// ==============================
// STATS
// ==============================

exports.getStats = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const stats = await About.getStats(type);
  res.json({ success: true, data: stats });
});

exports.createStat = asyncHandler(async (req, res) => {
  const stat = await About.createStat(req.body);
  res.status(201).json({ success: true, message: 'Stat created', data: stat });
});

exports.updateStat = asyncHandler(async (req, res) => {
  const stat = await About.updateStat(req.params.id, req.body);
  if (!stat) {
    return res.status(404).json({ success: false, message: 'Stat not found' });
  }
  res.json({ success: true, message: 'Stat updated', data: stat });
});

exports.deleteStat = asyncHandler(async (req, res) => {
  const deleted = await About.deleteStat(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Stat not found' });
  }
  res.json({ success: true, message: 'Stat deleted' });
});

// ==============================
// PILLARS
// ==============================

exports.getPillars = asyncHandler(async (req, res) => {
  const pillars = await About.getPillars();
  res.json({ success: true, data: pillars });
});

exports.createPillar = asyncHandler(async (req, res) => {
  const pillar = await About.createPillar(req.body);
  res.status(201).json({ success: true, message: 'Pillar created', data: pillar });
});

exports.updatePillar = asyncHandler(async (req, res) => {
  const pillar = await About.updatePillar(req.params.id, req.body);
  if (!pillar) {
    return res.status(404).json({ success: false, message: 'Pillar not found' });
  }
  res.json({ success: true, message: 'Pillar updated', data: pillar });
});

exports.deletePillar = asyncHandler(async (req, res) => {
  const deleted = await About.deletePillar(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Pillar not found' });
  }
  res.json({ success: true, message: 'Pillar deleted' });
});

// ==============================
// FAQS
// ==============================

exports.getFaqs = asyncHandler(async (req, res) => {
  const faqs = await About.getFaqs();
  res.json({ success: true, data: faqs });
});

exports.createFaq = asyncHandler(async (req, res) => {
  const faq = await About.createFaq(req.body);
  res.status(201).json({ success: true, message: 'FAQ created', data: faq });
});

exports.updateFaq = asyncHandler(async (req, res) => {
  const faq = await About.updateFaq(req.params.id, req.body);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, message: 'FAQ updated', data: faq });
});

exports.deleteFaq = asyncHandler(async (req, res) => {
  const deleted = await About.deleteFaq(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, message: 'FAQ deleted' });
});
