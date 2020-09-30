import request from "supertest";
import { app } from "../../app";

import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";

it("should return 400 when a bad email provided", () => {
  const faultyUserPayload = {
    email: "test",
    first_name: "Jon",
    last_name: "Smith",
    password: "test12345",
    password_confirm: "test12345",
    phone: "+306980000000",
  };

  return request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);
});
it("should return 400 when a phone is provided", async () => {
  const faultyUserPayload = {
    email: "test@test.com",
    first_name: "Jon",
    last_name: "Smith",
    password: "test12345",
    password_confirm: "test12345",
    phone: "12345678",
  };

  return request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);
});
it("should return 400 when password & password confirm aren't identical", async () => {
  const faultyUserPayload = {
    email: "test@test.com",
    first_name: "Jon",
    last_name: "Smith",
    password: "test12345",
    password_confirm: "test123456",
    phone: "+306980000000",
  };

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);

  // @ts-ignore
  faultyUserPayload.password_confirm = undefined;
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);

  // @ts-ignore
  faultyUserPayload.password = undefined;
  request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);
});
it("should return 400 when any of the required fields are empty and the same count of errors", async () => {
  const faultyUserPayload = {
    // email: "test@test.com",
    // first_name: "Jon",
    // last_name: "Smith",
    // phone: "12345678",
    password: "test12345",
    password_confirm: "test12345",
  };

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);

  expect(response.body.errors.length).toEqual(4);
});

it("should return 201 given a correct payload", async () => {
  request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
});

it("should set a cookie after successful signup", async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("should return 400 when user with the same email exist", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(400);
});