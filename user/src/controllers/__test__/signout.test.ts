import request from "supertest";
import { app } from "../../app";
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";

it("should clear the cookie after successful signout", async () => {
  // Create user
  const validResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  // Signout user
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signout`)
    .send({})
    .expect(200);

  // The express:sess will be equal to null
  expect(response.get("Set-Cookie")).not.toEqual(
    validResponse.get("Set-Cookie")
  );
});
