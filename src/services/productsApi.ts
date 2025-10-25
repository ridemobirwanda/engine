import { api } from './apiClient';

export async function listProducts(params?: { is_active?: boolean; is_featured?: boolean; category_id?: string; limit?: number; max_stock?: number }) {
	const q = new URLSearchParams();
	if (params?.is_active !== undefined) q.set('is_active', String(params.is_active));
	if (params?.is_featured !== undefined) q.set('is_featured', String(params.is_featured));
	if (params?.category_id) q.set('category_id', params.category_id);
	if (params?.limit !== undefined) q.set('limit', String(params.limit));
	if (params?.max_stock !== undefined) q.set('max_stock', String(params.max_stock));
	const qs = q.toString();
	return await api.get(`/api/products${qs ? `?${qs}` : ''}`);
}

export async function createProduct(data: any) {
	return await api.post('/api/products', data);
}

export async function updateProduct(id: string | number, data: any) {
	return await api.put(`/api/products/${encodeURIComponent(String(id))}`, data);
}

export async function deleteProduct(id: string | number) {
	return await api.delete(`/api/products/${encodeURIComponent(String(id))}`);
}
