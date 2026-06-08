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
  const basicAuth = useAuthStore((state) => state.basicAuth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !basicAuth) {
      router.push("/login");
      return;
    }
    fetchOrders(user.id, basicAuth);
  }, [user, basicAuth]);

  async function fetchOrders(userId: number, token: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(userId, token);
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white font-sans">
      <nav className="flex items-center justify-between px-10 h-[60px] bg-black border-b border-zinc-900">
        <Link href="/products" className="no-underline">
          <span className="text-xl font-bold text-white">
            Vol<span className="text-green-500">tix</span>
          </span>
        </Link>
        <Link
          href="/profile"
          className="text-sm text-zinc-300 no-underline hover:text-green-400 transition"
        >
          {user?.name ?? "Perfil"}
        </Link>
      </nav>

      <div className="bg-black pt-10 pb-14 flex flex-col items-center gap-2">
        <div className="w-[60px] h-[60px] rounded-full border-2 border-green-500 flex items-center justify-center mb-3 shadow-[0_0_18px_rgba(34,197,94,0.35)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
        </div>
        <h1 className="text-zinc-300 text-2xl font-semibold m-0">
          Meus Pedidos
        </h1>
      </div>

      <div className="flex justify-center px-4 pb-16 -mt-8">
        <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl p-8 shadow-[0_4px_32px_rgba(0,0,0,0.4)] border border-zinc-800">
          {loading && (
            <p className="text-zinc-500 text-center py-12 text-sm animate-pulse">
              Carregando pedidos...
            </p>
          )}

          {error && !loading && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500 mb-5 text-sm">
                Você ainda não realizou nenhum pedido.
              </p>
              <Link
                href="/products"
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg no-underline text-sm transition"
              >
                Ver produtos
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="border-b border-zinc-800 pb-4 flex items-center justify-between gap-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-100 font-semibold text-[15px]">
                      Pedido #{order.id}
                    </span>
                    <span className="text-zinc-500 text-xs">
                      {formatDate(order.createdAt)} &nbsp;·&nbsp; {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "itens"}
                    </span>
                    <span className="text-zinc-300 text-sm font-medium mt-1">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2.5">
                    <span
                      className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${STATUS_COLOR[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-green-500 hover:text-green-400 text-xs font-semibold no-underline transition"
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