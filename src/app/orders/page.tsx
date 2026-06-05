"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrders } from "@/services/orderService";
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
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  PROCESSING: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  SHIPPED: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  DELIVERED: "text-green-400 bg-green-400/10 border-green-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #000000 0%, #0a0a0a 40%, #f4f4f4 40%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
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
        <Link
          href="/profile"
          style={{ color: "#d1d5db", fontSize: "0.9rem", textDecoration: "none" }}
        >
          {user?.name ?? "Perfil"}
        </Link>
      </nav>

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
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "2px solid #22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.75rem",
            boxShadow: "0 0 18px rgba(34,197,94,0.35)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
        </div>
        <h1 style={{ color: "#9ca3af", fontSize: "1.7rem", fontWeight: 600, margin: 0 }}>
          Meus Pedidos
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 1rem 4rem",
          marginTop: "-2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 680,
            backgroundColor: "#1c1c1c",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
          }}
        >
          {loading && (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "3rem 0", fontSize: "0.9rem" }}>
              Carregando pedidos...
            </p>
          )}

          {error && !loading && (
            <div
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "0.5rem",
                padding: "0.875rem 1rem",
                color: "#f87171",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p style={{ color: "#6b7280", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
                Você ainda não realizou nenhum pedido.
              </p>
              <Link
                href="/products"
                style={{
                  backgroundColor: "#22c55e",
                  color: "#000",
                  fontWeight: 700,
                  padding: "0.65rem 1.5rem",
                  borderRadius: "0.4rem",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Ver produtos
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {orders.map((order) => (
                <li
                  key={order.id}
                  style={{
                    borderBottom: "1px solid #2a2a2a",
                    paddingBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <span style={{ color: "#f9fafb", fontWeight: 600, fontSize: "0.95rem" }}>
                      Pedido #{order.id}
                    </span>
                    <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                      {formatDate(order.createdAt)} &nbsp;·&nbsp; {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "itens"}
                    </span>
                    <span style={{ color: "#d1d5db", fontSize: "0.85rem", fontWeight: 500 }}>
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        border: "1px solid",
                      }}
                      className={STATUS_COLOR[order.status]}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      style={{
                        color: "#22c55e",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}