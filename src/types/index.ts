export type UserRole = "dispatcher" | "driver";

export interface DriverProfile {
  vehicle_type: string;
  vehicle_plate_number: string;
  is_available: boolean;
  current_latitude: string | null;
  current_longitude: string | null;
  last_location_update: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  phone_number: string;
  driver_profile: DriverProfile | null;
}

export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'en_route'
  | 'awaiting_confirmation'
  | 'delivered'
  | 'disputed'
  | 'failed'
  | 'cancelled';

export type OrderPriority = "normal" | "urgent";

export interface Order {
  id: number;
  order_number: string;
  tracking_token: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_address: string;
  pickup_latitude: string;
  pickup_longitude: string;
  dropoff_address: string;
  dropoff_latitude: string;
  dropoff_longitude: string;
  status: OrderStatus;
  priority: OrderPriority;
  assigned_driver: number | null;
  assigned_driver_detail: User | null;
  time_window_start: string | null;
  time_window_end: string | null;
  delivery_notes: string;
  created_at: string;
  updated_at: string;
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface ProofOfDelivery {
  photo: string | null;
  signature: string | null;
  recipient_name: string;
  captured_at: string;
  confirmation_status: 'pending' | 'confirmed' | 'disputed';
  dispute_reason: string;
  confirmed_by_name: string;
  confirmed_at: string | null;
}

export interface PublicTrackingData {
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  pickup_address: string;
  pickup_latitude: string;
  pickup_longitude: string;
  dropoff_address: string;
  dropoff_latitude: string;
  dropoff_longitude: string;
  created_at: string;
  timeline: StatusEvent[];
  driver_location: {
    latitude: string;
    longitude: string;
    last_updated: string;
  } | null;
  proof_of_delivery: ProofOfDelivery | null;
}
