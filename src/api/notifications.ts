import { apiClient } from './client';
import type { PaginatedResponse } from '../types';

export type NotificationType = 'new_order' | 'delivered' | 'failed' | 'urgent';

export interface AppNotification {
  id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  order: number | null;
  order_number: string | null;
  is_read: boolean;
  created_at: string;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data } = await apiClient.get<PaginatedResponse<AppNotification>>('/notifications/');
  return data.results;
}

export async function fetchUnreadCount(): Promise<{ unread_count: number }> {
  const { data } = await apiClient.get('/notifications/unread-count/');
  return data;
}

export async function markAllRead(): Promise<void> {
  await apiClient.post('/notifications/mark-all-read/');
}

export async function markOneRead(id: number): Promise<void> {
  await apiClient.post(`/notifications/${id}/mark-read/`);
}