import request from 'supertest';
import _ from 'lodash';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';

// jest.setTimeout(30000);

it('should return 401 when user is not an admin', async () => {
  await request(app).get(`${API_ROOT_ENDPOINT}/users`).send({}).expect(401);
});

it('should return all users', async () => {
  // Create one User
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  // Create second user
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send({ ...USER_CREATE_VALID_PAYLOAD, email: 'test2@test.com' })
    .expect(201);

  const { cookie } = await global.signinAdmin();

  // Fetch All users
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  // 2 users and 1 admin
  expect(response.body.data.users.length).toEqual(3);
});

// Testing filtering
it('should return only second user', async () => {
  // Create User one
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  // Create User Two
  USER_CREATE_VALID_PAYLOAD.first_name = 'testname';
  USER_CREATE_VALID_PAYLOAD.email = 'tester2@test.com';
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  const { cookie } = await global.signinAdmin();

  // Select users with first_name=testname
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?first_name=testname`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.data.users.length).toEqual(2);
  expect(response.body.data.users[1].first_name).toEqual('testname');
});

// Testing fields filtering
it('should return only id, phone, email and addresses', async () => {
  // Create User
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
  const { cookie } = await global.signinAdmin();
  // Select only email,phone ( address id are attached automatically )
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?fields=email,phone`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(_.keys(response.body.data.users[1]).length).toEqual(4);
  expect(response.body.data.users[1].id).toBeDefined();
  expect(response.body.data.users[1].email).toBeDefined();
  expect(response.body.data.users[1].addresses).toBeDefined();
  expect(response.body.data.users[1].phone).toBeDefined();
});

// Testing Limit
it('should return 1 document and totalCount equal to 2', async () => {
  // Create user One
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  // Create user two
  USER_CREATE_VALID_PAYLOAD.email = 'test2@test.com';
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  const { cookie } = await global.signinAdmin();

  // Limit query by 1
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?limit=1`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  // Should return one document and totalCount should be 3
  expect(response.body.results).toEqual(1);
  expect(response.body.totalCount).toEqual(3);
});

// Testing Sorting
it('should return documents ordered by email ASC', async () => {
  // Create user One
  USER_CREATE_VALID_PAYLOAD.email = 'aaatest@test.com';
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  // Create User Two
  USER_CREATE_VALID_PAYLOAD.email = 'aaaatest@test.com';
  await User.build(USER_CREATE_VALID_PAYLOAD).save();
  const { cookie } = await global.signinAdmin();
  // Sort by email
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?sort=email`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  // Instead of user one the second user should be first
  expect(response.body.data.users[0].email).toEqual('aaaatest@test.com');
  expect(response.body.data.users[1].email).toEqual('aaatest@test.com');
});

// Testing Advanced Sorting
it('should return 0 document for first and 2 document for second request', async () => {
  // Create User
  await User.build(USER_CREATE_VALID_PAYLOAD).save();

  // Select users  where created_at is greater or equal to provided date
  const now = Date.now();
  const { cookie } = await global.signinAdmin();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?created_at[gte]=${now}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(response.body.data.users.length).toEqual(0);

  // Select users  where created_at is lower or equal to provided date
  const responseTwo = await request(app)
    .get(`${API_ROOT_ENDPOINT}/users?created_at[lte]=${now}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(responseTwo.body.data.users.length).toEqual(2);
});
