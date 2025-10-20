const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  // Get IP address and user agent
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');
  
  // Create contact message
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
    ipAddress,
    userAgent
  });
  
  // Send email notification
  try {
    const emailMessage = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      <p><small>IP: ${ipAddress}</small></p>
    `;
    
    await sendEmail({
      to: 'mraashish0x1@duck.com',
      subject: `Portfolio Contact: ${subject}`,
      html: emailMessage
    });
    
    // Send auto-reply to user
    const autoReplyMessage = `
      <h2>Thank you for contacting me!</h2>
      <p>Hi ${name},</p>
      <p>I've received your message and will get back to you as soon as possible.</p>
      <p><strong>Your message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <br>
      <p>Best regards,</p>
      <p>MrAashish0x1</p>
    `;
    
    await sendEmail({
      to: email,
      subject: 'Thank you for your message',
      html: autoReplyMessage
    });
    
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't fail the request if email fails
  }
  
  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject
    }
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Contact.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: contacts
  });
});

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private (Admin)
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }
  
  // Mark as read
  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save();
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private (Admin)
exports.updateContactStatus = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  
  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return next(new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404));
  }
  
  await contact.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

