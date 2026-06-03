export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  items: OrderItem[];
  address: OrderAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: "CREDIT_CARD" | "PIX" | "BOLETO";
}

export interface CreateOrderResponse {
  order: Order;
  message: string;
}
