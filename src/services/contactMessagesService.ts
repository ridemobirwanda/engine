import { api } from './apiClient';

export interface ContactMessage {
  id?: number | string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status?: string | null;
  admin_notes?: string | null;
  created_at?: string;
  responded_at?: string | null;
}

export async function getMessages({ page = 1, pageSize = 20, status, search }: { page?: number, pageSize?: number, status?: string, search?: string }) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return await api.get(`/api/contact-messages?${params.toString()}`);
}

export async function getMessageById(id: number | string): Promise<ContactMessage | null> {
  // Not implemented on API yet; would be /api/contact-messages/:id (GET)
  throw new Error('getMessageById not implemented');
}

export async function insertMessage(msg: ContactMessage): Promise<void> {
  await api.post('/api/contact-messages', msg);
}

export async function updateMessage(id: number | string, fields: Partial<ContactMessage>): Promise<void> {
  await api.put(`/api/contact-messages/${id}`, fields);
}

export async function deleteMessage(id: number | string): Promise<void> {
  await api.delete(`/api/contact-messages/${id}`);
}
