import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { UserRole } from "@sin-nombre/sinfood-common";
import faker from "faker";
import { app } from "../app";
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from "../utils/constants";
import { RestaurantDoc } from "../models/restaurant";

jest.mock("../events/nats-wrapper"); // Mock file into the fake

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<{ cookie: string[]; user: RestaurantDoc }>;
      signinAdmin(): Promise<{ cookie: string[]; user: RestaurantDoc }>;
    }
  }
}
let mongo: any;

// Start MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = "test-jwt-token-restaurant";
  process.env.NODE_ENV = "test";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    cookie: response.get("Set-Cookie"),
    user: response.body.data.user as RestaurantDoc,
  };
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
    cookie: response.get("Set-Cookie"),
    user: response.body.data.user as RestaurantDoc,
  };
};
