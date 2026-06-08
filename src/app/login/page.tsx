"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Logo } from "@/components/logo/Logo";
import { IoPersonCircle } from "react-icons/io5";
import { CircleAuth } from "@/components/component-circle-login/CircleAuth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha email e senha.");
      return;
    }

    setLoading(true);

    try {
      const user = await login({ email, password });
      setAuth(user, password);
      router.push("/products");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100">
      <section className="relative min-h-[38vh] bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6 py-6 text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <Link href="/login" className="text-2xl font-bold tracking-tight">
              <span className="text-green-500">Vol</span>tix
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-300 transition hover:text-green-400"
          >
            Contato
          </Link>
        </header>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center text-center">
          <CircleAuth icon={<IoPersonCircle />} />

          <h1 className="mt-5 text-xl font-semibold md:text-3xl text-gray-500">
            Acesse sua conta
          </h1>

        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 w-full max-w-md px-6 pb-10 ">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">Email</span>
              <input
                className="w-full border-b border-zinc-700 bg-transparent px-1 py-2 text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="seuemail@email.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">Senha</span>
              <input
                className="w-full border-b border-zinc-700 bg-transparent px-1 py-2 text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Digite sua senha"
              />
            </label>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-green-400 transition hover:text-green-300"
              >
                Esqueci minha senha
              </Link>
            </div>

            {error ? (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            ) : null}

            <button
              className="w-full rounded-md bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-zinc-600"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Não possui uma conta?{" "}
            <Link
              href="/register"
              className="font-medium text-green-400 transition hover:text-green-300"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}