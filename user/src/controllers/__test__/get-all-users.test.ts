import request from "supertest";
import _ from 'lodash';
import { app } from "../../app";
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";
import { User } from "../../models/user";

jest.setTimeout(30000);

it("should return all users", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
  USER_CREATE_VALID_PAYLOAD.email = "test2@test.com";
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users`)
    .send({})
    .expect(200);

  expect(response.body.data.length).toEqual(2);
});

it("should return only second user", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  USER_CREATE_VALID_PAYLOAD.first_name = "testname";
  USER_CREATE_VALID_PAYLOAD.email = "tester2@test.com";

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?first_name=testname`)
    .send({})
    .expect(200);

  expect(response.body.data.length).toEqual(1);
  expect(response.body.data[0].first_name).toEqual("testname");
});

it("should return only id, phone, email and addresses", async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?fields=email,phone`)
    .send({})
    .expect(200);

  expect(_.keys(response.body.data[0]).length).toEqual(4);
  expect(response.body.data[0].id).toBeDefined();
  expect(response.body.data[0].email).toBeDefined();
  expect(response.body.data[0].addresses).toBeDefined();
  expect(response.body.data[0].phone).toBeDefined();
});
