import request from "supertest";
import _ from "lodash";
import { app } from "../../app";
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from "../../utils/constants";
import { User } from "../../models/user";

// jest.setTimeout(30000);

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

// Testing filtering
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

// Testing fields filtering
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

// Testing Limit
it("should return 1 document and totalCount equal to 2", async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  USER_CREATE_VALID_PAYLOAD.email = "test2@test.com";
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?limit=1`)
    .send({})
    .expect(200);

  expect(response.body.results).toEqual(1);
  expect(response.body.totalCount).toEqual(2);
});

// Testing Sorting
it("should return documents ordered by email ASC", async () => {
  USER_CREATE_VALID_PAYLOAD.email = "atest@test.com";
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  USER_CREATE_VALID_PAYLOAD.email = "aatest@test.com";
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?sort=email`)
    .send({})
    .expect(200);

  expect(response.body.data[0].email).toEqual("aatest@test.com");
  expect(response.body.data[1].email).toEqual("atest@test.com");
});

// Testing Advanced Sorting
it("should return 0 document for first and 1 document for second request", async () => {
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  const now = Date.now();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?created_at[gte]=${now}`)
    .send({})
    .expect(200);
  expect(response.body.data.length).toEqual(0);

  const responseTwo = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?created_at[lte]=${now}`)
    .send({})
    .expect(200);
  expect(responseTwo.body.data.length).toEqual(1);
});
