import request from '@/utils/request';

export async function getAllCategories() {
  return request(`/menu/categories?nopaginate=true`, {
    method: 'GET',
  });
}
export async function createCategory(data: { name: string }) {
  return request(`/menu/categories`, {
    method: 'POST',
    data,
  });
}

export async function updateCategory(id: string, data: { name: string }) {
  return request(`/menu/categories/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteCategory(id: string) {
  return request(`/menu/categories/${id}`, {
    method: 'DELETE',
  });
}
