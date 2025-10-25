import { api } from './apiClient';

export async function listCategories() {
	return await api.get('/api/categories');
}

export async function getCategoryBySlug(slug: string) {
	return await api.get(`/api/categories/by-slug/${encodeURIComponent(slug)}`);
}

export async function createCategory(data: any) {
	return await api.post('/api/categories', data);
}

export async function updateCategory(id: string | number, data: any) {
	return await api.put(`/api/categories/${encodeURIComponent(String(id))}`, data);
}

export async function deleteCategory(id: string | number) {
	return await api.delete(`/api/categories/${encodeURIComponent(String(id))}`);
}
