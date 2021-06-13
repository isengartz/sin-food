import request from '@/utils/request';

export type LoginParamsType = {
  email: string;
  password: string;
};

export async function accountLogin(params: LoginParamsType) {
  return request(`/restaurants/signin`, {
    method: 'POST',
    data: params,
  });
}

export async function accountLogout() {
  return request('/restaurants/logout', {
    method: 'POST',
  });
}
