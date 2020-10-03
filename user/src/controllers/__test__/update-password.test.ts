import request from "supertest";
import { app } from "../../app";
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";

it("should return 401 when user isn't logged in", async () => {
  request(app).patch(`${API_ROOT_ENDPOINT}/users/updatePassword`).expect(401);
});

it("should return 400 when password or new_password aren't provided", async () => {
  const cookie = await global.signin();
  await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/updatePassword`)
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("should return 401 when password is invalid", async () => {
  const cookie = await global.signin();
  await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/updatePassword`)
    .set("Cookie", cookie)
    .send({ password: "randomPassword", new_password: "new_password" })
    .expect(401);
});

it("should return 200 on valid request", async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .patch(`${API_ROOT_ENDPOINT}/users/updatePassword`)
    .set("Cookie", cookie)
    .send({
      password: USER_CREATE_VALID_PAYLOAD.password,
      new_password: "new_password",
    })
    .expect(200);

});
