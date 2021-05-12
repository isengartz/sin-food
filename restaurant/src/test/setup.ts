import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import mongoose from 'mongoose';
import { UserRole } from '@sin-nombre/sinfood-common';
import faker from 'faker';
import { app } from '../app';
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from '../utils/constants';
import { RestaurantDoc } from '../models/restaurant';

jest.mock('../events/nats-wrapper'); // Mock file into the fake

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<{ cookie: string[]; user: RestaurantDoc }>;
      signinAdmin(): Promise<{ cookie: string[]; user: RestaurantDoc }>;
      signinUser(id?: string): string[];
    }
  }
}
let mongo: any;

// Start MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-token-restaurant';
  process.env.NODE_ENV = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

// Before Each Test Reset Collection data
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  // eslint-disable-next-line no-restricted-syntax
  for (const collection of collections) {
    // eslint-disable-next-line no-await-in-loop
    await collection.deleteMany({});
  }
});

// Close MongoMemoryServer and detach mongoose from it
afterAll(async () => {
  try {
    await mongo.stop();
    await mongoose.connection.close();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.debug(e);
  }
});

global.signin = async () => {
  // So we can use it more than one to generate random users
  RESTAURANT_CREATE_VALID_PAYLOAD.name = faker.company.companyName();
  RESTAURANT_CREATE_VALID_PAYLOAD.email = faker.internet.email();
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);
  return {
    cookie: response.get('Set-Cookie'),
    user: response.body.data.user as RestaurantDoc,
  };
};

global.signinUser = (id?: string) => {
  // So we can use it more than one to generate random users
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    role: UserRole.User,
  };
  return buildPayload(payload);
};

global.signinAdmin = async () => {
  // So we can use it more than one to generate random users

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send({
      ...RESTAURANT_CREATE_VALID_PAYLOAD,
      email: faker.internet.email(),
      name: faker.company.companyName(),
      role: UserRole.Admin,
      admin_passphrase: process.env.ADMIN_ALLOW_PASSWORD,
    })
    .expect(201);

  return {
    cookie: response.get('Set-Cookie'),
    user: response.body.data.user as RestaurantDoc,
  };
};

const buildPayload = (payload: {
  id: string;
  email: string;
  role: UserRole;
}) => {
  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
