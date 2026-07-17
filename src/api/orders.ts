import { apiClient } from "./client";
import type {
  Order,
  OrderPriority,
  OrderStatus,
  PaginatedResponse,
  User,
} from "../types";

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  priority: OrderPriority;
  delivery_notes: string;
}

export interface UpdateStatusPayload {
  status: string;
  latitude?: number;
  longitude?: number;
  note?: string;
}

export interface PublicOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  delivery_notes: string;
}

export interface PublicOrderResponse {
  order_number: string;
  tracking_token: string;
  status: OrderStatus;
  message: string;
}

export interface DispatcherStats {
  total_today: number;
  pending: number;
  active: number;
  delivered_today: number;
  urgent: number;
}

export interface OverviewResponse {
  stats: DispatcherStats;
  unassigned_orders: Order[];
}

export async function fetchOrders(
  page: number = 1,
): Promise<PaginatedResponse<Order>> {
  const { data } = await apiClient.get<PaginatedResponse<Order>>("/orders/", {
    params: { page },
  });
  return data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders/", payload);
  return data;
}

export async function fetchDriverList(
  page: number = 1,
): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>(
    "/auth/drivers/",
    {
      params: { page },
    },
  );
  return data;
}

export async function assignDriver(
  orderId: number,
  driverId: number,
): Promise<Order> {
  const { data } = await apiClient.post<Order>(
    `/orders/${orderId}/assign-driver/`,
    {
      driver_id: driverId,
    },
  );
  return data;
}

export async function fetchOrder(orderId: number): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${orderId}/`);
  return data;
}

export async function updateOrderStatus(
  orderId: number,
  payload: UpdateStatusPayload,
): Promise<Order> {
  const { data } = await apiClient.post<Order>(
    `/orders/${orderId}/update-status/`,
    payload,
  );
  return data;
}

export async function createPublicOrder(
  payload: PublicOrderPayload,
): Promise<PublicOrderResponse> {
  const { data } = await apiClient.post<PublicOrderResponse>(
    "/orders/public/create/",
    payload,
  );
  return data;
}

export async function fetchOverview(): Promise<OverviewResponse> {
  const { data } = await apiClient.get<OverviewResponse>("/orders/overview/");
  return data;
}
