import { api } from './apiClient';

export async function getCart(userId: string) {
	return await api.get(`/api/cart?user_id=${encodeURIComponent(userId)}`);
}

export async function addOrIncrement(userId: string, productId: string, quantity: number) {
	return await api.post('/api/cart', { user_id: userId, product_id: productId, quantity });
}

export async function updateQuantity(cartItemId: string | number, quantity: number) {
	return await api.put(`/api/cart/${cartItemId}`, { quantity });
}

export async function removeItem(cartItemId: string | number) {
	return await api.delete(`/api/cart/${cartItemId}`);
}

export async function clearUserCart(userId: string) {
	return await api.delete(`/api/cart/user/${encodeURIComponent(userId)}`);
}

export async function syncCart(userId: string, items: { product_id: string; quantity: number }[]) {
	return await api.post('/api/cart/sync', { user_id: userId, items });
}
