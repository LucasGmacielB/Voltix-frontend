"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { resetPassword } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Logo } from "@/components/logo/Logo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(token ? "" : "Token não encontrado.");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Token não encontrado.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Preencha a nova senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-300">Nova senha</span>
          <input
            className="w-full border-b border-zinc-700 bg-transparent px-1 py-2 text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500 disabled:cursor-not-allowed disabled:text-zinc-500"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            disabled={!token}
            placeholder="Digite sua nova senha"
          />
        </label>

        {message ? (
          <p className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <button
          className="w-full rounded-md bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-zinc-600"
          type="submit"
          disabled={loading || !token}
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Já redefiniu sua senha?{" "}
        <Link
          href="/login"
          className="font-medium text-green-400 transition hover:text-green-300"
        >
          Voltar para login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-zinc-100">
      <section className="relative min-h-[50vh] bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6 py-6 text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />

          <Link
            href="/"
            className="text-sm text-zinc-300 transition hover:text-green-400"
          >
            Contato
          </Link>
        </header>

        <div className="mx-auto mt-26 flex max-w-6xl flex-col items-center text-center">

          <h1 className="mt-5 text-2xl font-semibold md:text-3xl">
            Redefinir senha
          </h1>

          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Digite uma nova senha para recuperar o acesso à sua conta Voltix.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 w-full max-w-md px-4 pb-10">
        <Suspense
          fallback={
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center text-sm text-zinc-400 shadow-2xl">
              Carregando...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}