/* eslint-disable no-unused-vars */
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { API_ROOT_ENDPOINT } from "../utils/constants";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}
let mongo: any;

// Start MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = "test-jwt-token";
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
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}users/signup`)
    .send({
      email,
      password,
    })
    .expect(201);

  return response.get("Set-Cookie");
};
