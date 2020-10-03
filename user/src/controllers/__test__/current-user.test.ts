import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";

it("should return empty object when user isn't signin'ed", async () => {
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/currentUser`)
    .send()
    .expect(200);
  expect(response.body.data.currentUser).toEqual(null);
});

it("should return users payload on success", async () => {
  // Create the User
  await User.build(USER_CREATE_VALID_PAYLOAD).save();
  // Login the user
  const loginRes = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/login`)
    .send({
      email: USER_CREATE_VALID_PAYLOAD.email,
      password: USER_CREATE_VALID_PAYLOAD.password,
    })
    .expect(200);

  // Set the cookie from prev request and call current-user endpoint
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users/currentUser`)
    .set("Cookie", loginRes.get("Set-Cookie"))
    .send()
    .expect(200);
  expect(response.body.data.currentUser.email).toEqual(
    USER_CREATE_VALID_PAYLOAD.email
  );
});
