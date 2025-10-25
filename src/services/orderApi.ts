import { api } from './apiClient';

export async function createOrderApi(order: any, items: any[]) {
	return await api.post('/api/orders', { order, items });
}

export async function updateOrderApi(orderId: string, data: any) {
	return await api.put(`/api/orders/${encodeURIComponent(orderId)}`, data);
}

export async function getUserOrdersApi(userId: string) {
	return await api.get(`/api/orders/user/${encodeURIComponent(userId)}`);
}

export async function getOrderByIdApi(orderId: string) {
	return await api.get(`/api/orders/${encodeURIComponent(orderId)}`);
}
