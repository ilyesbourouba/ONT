const VisitAlgeria = require('../model/VisitAlgeria');
const { asyncHandler } = require('../utils/helpers');

exports.getContent = asyncHandler(async (req, res) => {
  const content = await VisitAlgeria.getContent();
  res.json({ success: true, data: content });
});

exports.updateContent = asyncHandler(async (req, res) => {
  const content = await VisitAlgeria.updateContent(req.body);
  res.json({ success: true, message: 'Content updated', data: content });
});
