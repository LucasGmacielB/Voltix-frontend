import { api } from "@/services/api";
import type { CreateOrderRequest, CreateOrderResponse, Order } from "@/types/order";

function authHeader(basicAuth: string) {
  return {
    headers: {
      Authorization: basicAuth,
    },
  };
}

export async function getOrders(userId: number, basicAuth: string): Promise<Order[]> {
  const response = await api.get<Order[]>(`/orders/user/${userId}`, authHeader(basicAuth));
  return response.data;
}

export async function getOrderById(id: number, basicAuth: string): Promise<Order> {
  const response = await api.get<Order>(`/orders/${id}`, authHeader(basicAuth));
  return response.data;
}

export async function createOrder(
  userId: number,
  data: CreateOrderRequest,
  basicAuth: string
): Promise<CreateOrderResponse> {
  const response = await api.post<CreateOrderResponse>(
    `/orders/user/${userId}`,
    data,
    authHeader(basicAuth)
  );
  return response.data;
}

export async function cancelOrder(id: number, basicAuth: string): Promise<{ message: string }> {
  const response = await api.patch<{ message: string }>(
    `/orders/${id}/cancel`,
    null,
    authHeader(basicAuth)
  );
  return response.data;
}