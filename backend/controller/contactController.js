const Contact = require('../model/Contact');
const { asyncHandler, paginate, paginationResponse } = require('../utils/helpers');

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully. We will get back to you soon.',
    data: { id: contact.id }
  });
});

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Protected
 */
exports.getAllContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { offset, limit: lim } = paginate(page, limit);
  
  const contacts = await Contact.findAll(lim, offset);
  const total = await Contact.count();
  
  res.json({
    success: true,
    ...paginationResponse(contacts, total, page, lim)
  });
});

/**
 * @desc    Get single contact submission
 * @route   GET /api/contact/:id
 * @access  Protected
 */
exports.getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact submission not found'
    });
  }
  
  res.json({
    success: true,
    data: contact
  });
});

/**
 * @desc    Delete contact submission
 * @route   DELETE /api/contact/:id
 * @access  Protected
 */
exports.deleteContact = asyncHandler(async (req, res) => {
  const deleted = await Contact.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Contact submission not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Contact submission deleted successfully'
  });
});
