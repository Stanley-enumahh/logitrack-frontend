import { apiClient } from "./client";
import type { PaginatedResponse, User } from "../types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface CreateDriverPayload {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  vehicle_type: string;
  vehicle_plate_number: string;
}

export interface DriverAvailability {
  available: number;
  offline: number;
  total: number;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  phone_number: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/token/", payload);
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me/");
  return data;
}

// Decode JWT payload without a library — we only need the role for routing
export function decodeToken(token: string): {
  role: string;
  username: string;
  user_id: string;
} {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
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

export async function createDriver(
  payload: CreateDriverPayload,
): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/drivers/create/", payload);
  return data;
}

export async function fetchDriverAvailability(): Promise<DriverAvailability> {
  const { data } = await apiClient.get<DriverAvailability>(
    "/auth/drivers/availability/",
  );
  return data;
}

export async function signupDispatcher(payload: SignupPayload) {
  const { data } = await apiClient.post("/auth/signup/", payload);
  return data;
}

export async function verifyEmail(token: string) {
  const { data } = await apiClient.post(`/auth/verify-email/${token}/`);
  return data;
}

export async function resendVerification(email: string) {
  const { data } = await apiClient.post("/auth/resend-verification/", {
    email,
  });
  return data;
}


export interface SendInvitePayload {
  email: string;
}

export async function sendInvite(payload: SendInvitePayload) {
  const { data } = await apiClient.post('/auth/invite/', payload);
  return data;
}

export interface AcceptInvitePayload {
  token: string;
  username: string;
  password: string;
  phone_number?: string;
}

export async function acceptInvite(payload: AcceptInvitePayload) {
  const { data } = await apiClient.post('/auth/accept-invite/', payload);
  return data;
}