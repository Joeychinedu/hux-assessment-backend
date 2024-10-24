const fs = require('fs');
const Contact = require('../models/contactModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts,
    },
  });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});

exports.createContact = catchAsync(async (req, res, next) => {
  const newContact = await Contact.create({ ...req.body, user: req.user });

  res.status(201).json({
    status: 'success',
    data: {
      contact: newContact,
    },
  });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );

  if (!updatedContact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      contact: updatedContact,
    },
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
