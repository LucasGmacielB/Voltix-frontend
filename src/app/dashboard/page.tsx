"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <section className="mx-auto w-full max-w-2xl space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Area simples para usuario logado.
          </p>
        </div>

        {user ? (
          <div className="space-y-2 rounded-md border border-zinc-200 p-4">
            <p className="text-sm text-zinc-600">Usuario atual</p>
            <p className="font-medium text-zinc-950">{user.name}</p>
            <p className="text-zinc-700">{user.email}</p>
          </div>
        ) : (
          <div className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              Nenhum usuario encontrado no estado da aplicacao.
            </p>
            <Link className="text-sm font-medium text-amber-950 underline" href="/login">
              Ir para login
            </Link>
          </div>
        )}

        <button
          className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white"
          type="button"
          onClick={handleLogout}
        >
          Sair
        </button>
      </section>
    </main>
  );
}
