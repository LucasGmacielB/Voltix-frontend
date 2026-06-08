"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderById, cancelOrder } from "@/services/orderService";
import { useAuthStore } from "@/store/useAuthStore";
import type { Order, OrderStatus } from "@/types/order";
import { getErrorMessage } from "@/utils/getErrorMessage";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "rgba(250,204,21,0.1)",
  CONFIRMED: "rgba(96,165,250,0.1)",
  PROCESSING: "rgba(167,139,250,0.1)",
  SHIPPED: "rgba(34,211,238,0.1)",
  DELIVERED: "rgba(74,222,128,0.1)",
  CANCELLED: "rgba(248,113,113,0.1)",
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  PENDING: "#facc15",
  CONFIRMED: "#60a5fa",
  PROCESSING: "#a78bfa",
  SHIPPED: "#22d3ee",
  DELIVERED: "#4ade80",
  CANCELLED: "#f87171",
};

const STATUS_BORDER: Record<OrderStatus, string> = {
  PENDING: "rgba(250,204,21,0.2)",
  CONFIRMED: "rgba(96,165,250,0.2)",
  PROCESSING: "rgba(167,139,250,0.2)",
  SHIPPED: "rgba(34,211,238,0.2)",
  DELIVERED: "rgba(74,222,128,0.2)",
  CANCELLED: "rgba(248,113,113,0.2)",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const basicAuth = useAuthStore((state) => state.basicAuth);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user || !basicAuth) {
      router.push("/login");
      return;
    }
    if (params.id) fetchOrder(Number(params.id), basicAuth);
  }, [user, basicAuth, params.id]);

  async function fetchOrder(id: number, basicAuth: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(id, basicAuth);
      setOrder(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!order || !basicAuth) return;
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
    try {
      setCancelling(true);
      await cancelOrder(order.id, basicAuth);
      await fetchOrder(order.id, basicAuth);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  const canCancel =
    order && (order.status === "PENDING" || order.status === "CONFIRMED");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #000 0%, #0a0a0a 38%, #f4f4f4 38%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.5rem",
          height: "60px",
          backgroundColor: "#000",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>
            Vol<span style={{ color: "#22c55e" }}>tix</span>
          </span>
        </Link>
        <Link href="/profile" style={{ color: "#d1d5db", fontSize: "0.9rem", textDecoration: "none" }}>
          {user?.name ?? "Perfil"}
        </Link>
      </nav>

      {/* Header */}
      <div
        style={{
          backgroundColor: "#000",
          paddingTop: "2.5rem",
          paddingBottom: "3.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: 60, height: 60,
            borderRadius: "50%",
            border: "2px solid #22c55e",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "0.75rem",
            boxShadow: "0 0 18px rgba(34,197,94,0.35)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
        </div>
        <h1 style={{ color: "#9ca3af", fontSize: "1.7rem", fontWeight: 600, margin: 0 }}>
          {order ? `Pedido #${order.id}` : "Detalhes do Pedido"}
        </h1>
      </div>

      {/* Content */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 1rem 4rem", marginTop: "-2rem" }}>
        <div style={{ width: "100%", maxWidth: 680, display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Back */}
          <Link
            href="/orders"
            style={{ color: "#22c55e", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
          >
            ← Voltar para pedidos
          </Link>

          {loading && (
            <div style={{ backgroundColor: "#1c1c1c", borderRadius: "1rem", padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Carregando pedido...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "0.5rem",
              padding: "0.875rem 1rem",
              color: "#f87171",
              fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}

          {!loading && order && (
            <>
              {/* Status card */}
              <div style={{ backgroundColor: "#1c1c1c", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 32px rgba(0,0,0,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ color: "#f9fafb", fontWeight: 700, fontSize: "1rem" }}>Pedido #{order.id}</span>
                  <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>Realizado em {formatDate(order.createdAt)}</span>
                </div>
                <span style={{
                  fontSize: "0.75rem", fontWeight: 600,
                  padding: "0.3rem 0.9rem", borderRadius: "999px",
                  border: `1px solid ${STATUS_BORDER[order.status]}`,
                  backgroundColor: STATUS_COLOR[order.status],
                  color: STATUS_TEXT[order.status],
                }}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              {/* Items */}
              <div style={{ backgroundColor: "#1c1c1c", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
                <h2 style={{ color: "#9ca3af", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                  Itens do pedido
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0" }}>
                  {order.items.map((item) => {
                    const itemTotal = item.totalPrice ?? item.unitPrice * item.quantity;
                    return (
                      <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #2a2a2a" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          <span style={{ color: "#f9fafb", fontSize: "0.9rem", fontWeight: 500 }}>{item.productName}</span>
                          <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>{item.quantity}x {formatCurrency(item.unitPrice)}</span>
                        </div>
                        <span style={{ color: "#d1d5db", fontWeight: 600, fontSize: "0.9rem" }}>{formatCurrency(itemTotal)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Summary */}
              <div style={{ backgroundColor: "#1c1c1c", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
                <h2 style={{ color: "#9ca3af", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                  Resumo
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#6b7280" }}>
                    <span>Subtotal</span><span>{formatCurrency(order.subtotal ?? order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#6b7280" }}>
                    <span>Frete</span>
                    <span>{(order.shippingCost ?? 0) === 0 ? "Grátis" : formatCurrency(order.shippingCost ?? 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", fontWeight: 700, color: "#f9fafb", borderTop: "1px solid #2a2a2a", paddingTop: "0.6rem" }}>
                    <span>Total</span><span style={{ color: "#22c55e" }}>{formatCurrency(order.total ?? (order.subtotal ?? order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)) + (order.shippingCost ?? 0))}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ backgroundColor: "#1c1c1c", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
                <h2 style={{ color: "#9ca3af", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                  Endereço de entrega
                </h2>
                {order.address ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.875rem", color: "#d1d5db" }}>
                    <span>{order.address.street}, {order.address.number}{order.address.complement ? ` - ${order.address.complement}` : ""}</span>
                    <span>{order.address.neighborhood} — {order.address.city}/{order.address.state}</span>
                    <span style={{ color: "#6b7280" }}>CEP: {order.address.zipCode}</span>
                  </div>
                ) : (
                  <span style={{ color: "#d1d5db", fontSize: "0.9rem" }}>Endereço de entrega não informado.</span>
                )}
              </div>

              {/* Cancel */}
              {canCancel && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(248,113,113,0.4)",
                      color: "#f87171",
                      borderRadius: "0.5rem",
                      padding: "0.6rem 1.25rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      opacity: cancelling ? 0.5 : 1,
                    }}
                  >
                    {cancelling ? "Cancelando..." : "Cancelar pedido"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}