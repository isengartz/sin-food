import request from "supertest";
import { app } from "../../app";
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";
import { User } from "../../models/user";

it("should return 400 when email or password are undefined", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/login`)
    .send({ email: "test@test.com" })
    .expect(400);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/login`)
    .send({ password: "password" })
    .expect(400);
});

it("should return 404 when user doesnt exists", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/login`)
    .send({ email: "test@test.com", password: "password" })
    .expect(404);
});
// For security reasons we return 404 instead of 401 so we dont expose the email
it("should return 404 when incorrect email is provided", async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/login`)
    .send({ email: "test@test.com", password: "wrong_password" })
    .expect(404);
});

it("should return 200 and a cookie on successful request", async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/login`)
    .send({ email: "test@test.com", password: "test12345" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
