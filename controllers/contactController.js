const fs = require('fs');

// This is executed once and not in the EVENT LOOP so we can do it in a synchronous(blocking) way!
const contacts = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/contacts.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > contacts.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing first name or last name',
    });
  }

  next();
};

exports.getAllContacts = (req, res) => {
  console.log(req.requesTime);
  res.status(200).json({
    status: 'success',
    requestAt: req.requesTime,
    results: contacts.length,
    data: {
      contacts,
    },
  });
};

exports.getContact = (req, res) => {
  const id = req.params.id * 1;
  const contact = contacts.find((contact) => contact.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
};

exports.createContact = (req, res) => {
  // console.log(req.body);

  const newId = contacts[contacts.length - 1].id + 1;
  const newContact = Object.assign({ id: newId }, req.body);

  contacts.push(newContact);

  // Not uisng the asynchronous method because this callback function which is going to put it's event in th event loop queue
  fs.writeFile(
    `${__dirname}/dev-data/data/contacts-simple.json`,
    JSON.stringify(contacts),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          contact: newContact,
        },
      });
    }
  );
};

exports.updateContact = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      data: '<Updated tour here...>',
    },
  });
};

exports.deleteContact = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
