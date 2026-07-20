import { apiClient } from "./client";
import type {
  OrderStatus,
  PublicTrackingData,
  PaginatedResponse,
} from "../types";

export interface InternalStatusEvent {
  id: number;
  status: OrderStatus;
  actor_username: string | null;
  latitude: string | null;
  longitude: string | null;
  note: string;
  timestamp: string;
}

export interface SubmitPodPayload {
  photo: File;
  recipient_name: string;
  latitude: number;
  longitude: number;
}

export interface ConfirmDeliveryPayload {
  confirmed: boolean;
  confirmed_by_name: string;
  dispute_reason?: string;
}

export async function fetchOrderEvents(
  orderId: number,
): Promise<InternalStatusEvent[]> {
  const { data } = await apiClient.get<PaginatedResponse<InternalStatusEvent>>(
    `/tracking/orders/${orderId}/events/`,
  );
  return data.results;
}

export async function submitProofOfDelivery(
  orderId: number,
  payload: SubmitPodPayload,
) {
  const formData = new FormData();
  formData.append("photo", payload.photo);
  formData.append("recipient_name", payload.recipient_name);
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));

  const { data } = await apiClient.post(
    `/tracking/orders/${orderId}/proof-of-delivery/`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export async function fetchPublicTracking(
  trackingToken: string,
): Promise<PublicTrackingData> {
  const { data } = await apiClient.get<PublicTrackingData>(
    `/tracking/public/${trackingToken}/`,
  );
  return data;
}

export async function confirmDelivery(
  trackingToken: string,
  payload: ConfirmDeliveryPayload,
) {
  const { data } = await apiClient.post(
    `/tracking/confirm-delivery/${trackingToken}/`,
    payload,
  );
  return data;
}
