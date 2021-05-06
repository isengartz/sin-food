/* eslint-disable no-unused-vars */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { randomBytes } from 'crypto';
import request from 'supertest';
import mongoose from 'mongoose';
import { UserRole } from '@sin-nombre/sinfood-common';
import { app } from '../app';
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from '../utils/constants';
import { UserDoc } from '../models/user';

jest.mock('../events/nats-wrapper'); // Mock file into the fake
jest.mock('../utils/InternalEventEmitter'); // Mock file into the fake

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<{ cookie: string[]; user: UserDoc }>;
      signinAdmin(): Promise<{ cookie: string[]; user: UserDoc }>;
    }
  }
}
let mongo: any;

// Start MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-token';
  process.env.NODE_ENV = 'test';
  process.env.ADMIN_ALLOW_PASSWORD = 'test-passphrase';
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
  USER_CREATE_VALID_PAYLOAD.email = `${randomBytes(10).toString(
    'base64',
  )}@test.com`;
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
  return {
    cookie: response.get('Set-Cookie'),
    user: response.body.data.user as UserDoc,
  };
};

global.signinAdmin = async () => {
  // So we can use it more than one to generate random users
  USER_CREATE_VALID_PAYLOAD.email = `${randomBytes(10).toString(
    'base64',
  )}@test.com`;
  USER_CREATE_VALID_PAYLOAD.role = UserRole.Admin;
  // @ts-ignore
  USER_CREATE_VALID_PAYLOAD.admin_passphrase = process.env.ADMIN_ALLOW_PASSWORD;
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
  return {
    cookie: response.get('Set-Cookie'),
    user: response.body.data.user as UserDoc,
  };
};
