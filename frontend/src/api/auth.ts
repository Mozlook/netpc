import { apiClient } from "./client";
import { API_PATHS } from "./paths";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

export function register(body: RegisterRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(API_PATHS.auth.register, body);
}

export function login(body: LoginRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(API_PATHS.auth.login, body);
}

export function logout(): Promise<void> {
  return apiClient.post<void>(API_PATHS.auth.logout);
}

export function getMe(): Promise<AuthResponse> {
  return apiClient.get<AuthResponse>(API_PATHS.auth.me);
}
