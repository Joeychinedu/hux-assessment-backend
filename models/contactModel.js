const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A contact must have a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'A contact must have a lastname'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'A contact must have a phone number'],
    unique: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Contact must belong to a user'],
  },
});

// This populates the user field for all queries that starts with find
contactSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v',
  });

  next();
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
