import request from "supertest";
import { app } from "../../../app";
import { API_ROOT_ENDPOINT } from "../../../utils/constants";

it("should return 401 when no login", async () => {
  request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .send({ name: "Pizza" })
    .expect(401);
});
it("should return 401 when simple user is logged in", async () => {
  const { cookie } = await global.signin();
  request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .send({ name: "Pizza" })
    .set("Cookie", cookie)
    .expect(401);
});

it("should return 201 admin is logged in", async () => {
  const { cookie } = await global.signinAdmin();
  request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set("Cookie", cookie)
    .send({ name: "Pizza" })
    .expect(201);
});

it("should return 400 admin is logged in but no payload given", async () => {
  const { cookie } = await global.signinAdmin();
  request(app)
    .post(`${API_ROOT_ENDPOINT}/restaurants/categories`)
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});
