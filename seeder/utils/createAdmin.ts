import axios, { AxiosInstance } from 'axios';
import { BASE_API_URL } from './const';

export const createAdmin = async (instance: AxiosInstance) => {
  const payload = {
    email: 'superadmin1@test.com',
    first_name: 'Admin',
    password: 'test123456',
    password_confirm: 'test123456',
    last_name: 'Admin',
    role: 'admin',
    admin_passphrase: process.env.ADMIN_ALLOW_PASSWORD,
    phone: '+306981234567',
  };

  try {
    // First try to login the user
    const response = await instance.post(`${BASE_API_URL}/users/login`, {
      email: payload.email,
      password: payload.password,
    });
    return {
      cookie: response.headers['set-cookie'],
      user: response.data.data.user,
    };
  } catch (e) {
    console.log(e.response.data.errors || e.message);
    // else register a new one
    const response = await instance.post(
      `${BASE_API_URL}/users/signup`,
      payload,
      {
        withCredentials: true,
      },
    );
    return {
      cookie: response.headers['set-cookie'],
      user: response.data.user,
    };
  }
};
