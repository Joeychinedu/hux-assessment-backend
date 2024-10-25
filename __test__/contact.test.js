const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Import your Express app

let token;
let contactId;

// Set a global timeout of 30 seconds
jest.setTimeout(30000);

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000, // Server selection timeout
    socketTimeoutMS: 45000, // Socket timeout
  });

  // Mock user login to get token (assuming you have a login route set up)
  const response = await request(app)
    .post('/api/v1/login') // Replace with your actual login route
    .send({ email: 'testuser@example.com', password: 'password123' });

  token = response.body.token; // Save token for use in authorized requests
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('POST /api/v1/contacts - Create Contact', () => {
  it('should create a new contact successfully', async () => {
    const newContact = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    const response = await request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send(newContact);

    expect(response.status).toBe(201); // Assuming a successful creation returns 201
    expect(response.body.data.contact).toHaveProperty('_id');
    expect(response.body.data.contact.phoneNumber).toBe(newContact.phoneNumber);

    contactId = response.body.data.contact._id; // Save for update tests
  });

  it('should return validation error for missing required fields', async () => {
    const response = await request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'John' }); // Missing lastName and phoneNumber

    expect(response.status).toBe(400); // Bad request for validation error
    expect(response.body.message).toContain('lastName');
    expect(response.body.message).toContain('phoneNumber');
  });

  it('should return error for duplicate phone number', async () => {
    const duplicateContact = {
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '1234567890', // Same as first contact
    };

    const response = await request(app)
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send(duplicateContact);

    expect(response.status).toBe(400); // Bad request for duplicate error
    expect(response.body.message).toContain('phoneNumber must be unique');
  });
});

describe('PATCH /api/v1/contacts/:id - Update Contact', () => {
  it('should update an existing contact successfully', async () => {
    const updates = { lastName: 'UpdatedLastName' };

    const response = await request(app)
      .patch(`/api/v1/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(response.status).toBe(200); // Assuming 200 for successful update
    expect(response.body.data.contact.lastName).toBe(updates.lastName);
  });

  it('should return validation error for invalid update', async () => {
    const response = await request(app)
      .patch(`/api/v1/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ phoneNumber: 'notaphonenumber' }); // Invalid phone number format

    expect(response.status).toBe(400); // Bad request for validation error
    expect(response.body.message).toContain('phoneNumber');
  });

  it('should return 404 if contact does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId(); // Generate random valid ObjectId

    const response = await request(app)
      .patch(`/api/v1/contacts/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ lastName: 'NoName' });

    expect(response.status).toBe(404); // Not found
    expect(response.body.message).toBe('No contact found with that ID');
  });
});
