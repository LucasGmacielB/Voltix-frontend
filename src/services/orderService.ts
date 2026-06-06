import { api } from "@/services/api";
import type { CreateOrderRequest, CreateOrderResponse, Order } from "@/types/order";

export async function getOrders(): Promise<Order[]> {
  const response = await api.get<Order[]>("/orders");
  return response.data;
}

export async function getOrderById(id: number): Promise<Order> {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await api.post<CreateOrderResponse>("/orders", data);
  return response.data;
}

export async function cancelOrder(id: number): Promise<{ message: string }> {
  const response = await api.patch<{ message: string }>(`/orders/${id}/cancel`);
  return response.data;
}