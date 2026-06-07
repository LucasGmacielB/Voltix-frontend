import { api } from "@/services/api";
import type {
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from "@/types/auth";

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/auth/login", data);
  return response.data;
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>("/auth/forgot-password", {
    email,
  });
  return response.data;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<MessageResponse> {
  const data: ResetPasswordRequest = { token, newPassword };
  const response = await api.post<MessageResponse>("/auth/reset-password", data);
  return response.data;
}

export async function updateProfile(data: {
  id: number;
  name: string;
  email: string;
}) {
  const response = await api.put("/auth/profile", data);
  return response.data;
}

export async function changePassword(data: {
  id: number;
  currentPassword: string;
  newPassword: string;
}) {
  const response = await api.post("/auth/change-password", data);
  return response.data;
}
