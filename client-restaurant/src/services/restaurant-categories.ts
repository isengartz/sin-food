import request from '@/utils/request';

export async function getAllCategories() {
  return request(`/restaurants/categories`, {
    method: 'GET',
  });
}
