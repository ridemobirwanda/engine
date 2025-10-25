import { api } from './apiClient';

export interface AdminUser {
	id: string | number;
	user_id?: string;
	email?: string | null;
	role: 'super_admin' | 'admin';
	permissions: any;
	is_active: boolean;
	created_at?: string;
	updated_at?: string;
	last_login?: string | null;
}

export async function findActiveAdmin(params: { email?: string; user_id?: string }): Promise<AdminUser | null> {
	const q = new URLSearchParams();
	if (params.email) q.set('email', params.email);
	if (params.user_id) q.set('user_id', params.user_id);
	return await api.get(`/api/admin-users/find?${q.toString()}`);
}

export async function markLastLogin(id: string | number): Promise<void> {
	await api.put(`/api/admin-users/${id}/last-login`, {});
}
