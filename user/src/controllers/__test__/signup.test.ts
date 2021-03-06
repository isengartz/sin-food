import request from 'supertest';
import { Subjects, UserRole } from '@sin-nombre/sinfood-common';
import { app } from '../../app';
import {
  API_ROOT_ENDPOINT,
  USER_ADDRESS_CREATE_VALID_PAYLOAD,
  USER_CREATE_VALID_PAYLOAD,
} from '../../utils/constants';
import { User } from '../../models/user';
import InternalEventEmitter from '../../utils/InternalEventEmitter';
import { UserEvent } from '../../models/user-events';

it('should return 400 when a bad email provided', async () => {
  const faultyUserPayload = {
    email: 'test',
    first_name: 'Jon',
    last_name: 'Smith',
    password: 'test12345',
    password_confirm: 'test12345',
    phone: '+306980000000',
  };

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);
});
it('should return 400 when a bad phone is provided', async () => {
  const faultyUserPayload = {
    email: 'test@test.com',
    first_name: 'Jon',
    last_name: 'Smith',
    password: 'test12345',
    password_confirm: 'test12345',
    phone: '12345678',
  };

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);
});
it("should return 400 when password & password confirm aren't identical", async () => {
  const faultyUserPayload = {
    email: 'test@test.com',
    first_name: 'Jon',
    last_name: 'Smith',
    password: 'test12345',
    password_confirm: 'test123456',
    phone: '+306980000000',
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
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);
});
it('should return 400 when any of the required fields are empty and the same count of errors', async () => {
  const faultyUserPayload = {
    // email: "test@test.com",
    // first_name: "Jon",
    // last_name: "Smith",
    // phone: "12345678",
    password: 'test12345',
    password_confirm: 'test12345',
  };

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(faultyUserPayload)
    .expect(400);

  expect(response.body.errors.length).toEqual(4);
});

it('should return 201 given a correct payload', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
});

it('should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should return 400 when user with the same email exist', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(400);
});

it("should return a user with role 'user' when no admin secret is supplied", async () => {
  USER_CREATE_VALID_PAYLOAD.role = UserRole.Admin;
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
  expect(response.body.data.user.role).toEqual(UserRole.User);
});

it("should return a user with role 'admin' when admin secret is supplied", async () => {
  USER_CREATE_VALID_PAYLOAD.role = UserRole.Admin;
  // @ts-ignore
  USER_CREATE_VALID_PAYLOAD.admin_passphrase = process.env.ADMIN_ALLOW_PASSWORD;

  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);
  expect(response.body.data.user.role).toEqual(UserRole.Admin);
});

it('should not allow duplicate emails ', async () => {
  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(201);

  await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send(USER_CREATE_VALID_PAYLOAD)
    .expect(400);
});

it('should return 201 and address set when given a correct payload', async () => {
  const response = await request(app)
    .post(`${API_ROOT_ENDPOINT}/users/signup`)
    .send({
      ...USER_CREATE_VALID_PAYLOAD,
      addresses: [
        USER_ADDRESS_CREATE_VALID_PAYLOAD,
        USER_ADDRESS_CREATE_VALID_PAYLOAD,
      ],
    })
    .expect(201);

  const user = await User.findById(response.body.data.user.id);
  const events = await UserEvent.find({});
  expect(InternalEventEmitter.emitNatsEvent).toHaveBeenCalled();
  expect(events.length).toEqual(3);
  expect(user!.addresses.length).toEqual(2);
});
