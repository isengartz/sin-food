import request from "supertest";
import { app } from "../../../app";
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from "../../../utils/constants";

it("should return 400 when no required fields are set", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send({})
    .expect(400);
});

it("should return 400 when email already exist", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(400);
});

it("should return 201 when payload is correct", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);
});

it("should set a cookie after successful signup", async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("should return 400 when passwords dont match", async () => {
  RESTAURANT_CREATE_VALID_PAYLOAD.password_confirm = "wrong_password";
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/`)
    .send(RESTAURANT_CREATE_VALID_PAYLOAD)
    .expect(400);
});
