import { api } from './apiClient';

export interface WebsiteSetting {
  id?: number;
  key: string;
  value: string | boolean | number | any;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllSettings(): Promise<WebsiteSetting[]> {
  return await api.get('/api/settings');
}

export async function getSettingByKey(key: string): Promise<WebsiteSetting | null> {
  return await api.get(`/api/settings/${encodeURIComponent(key)}`);
}

export async function upsertSetting(setting: WebsiteSetting): Promise<void> {
  await api.post('/api/settings', setting);
}

export async function deleteSettingById(id: number): Promise<void> {
  await api.delete(`/api/settings/${id}`);
}
