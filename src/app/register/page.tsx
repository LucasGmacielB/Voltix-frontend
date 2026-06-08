"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Logo } from "@/components/logo/Logo";
import { FaCartShopping } from "react-icons/fa6";
import { CircleAuth } from "@/components/component-circle-login/CircleAuth";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha nome, email e senha.");
      return;
    }

    setLoading(true);

    try {
      const user = await register({ name, email, password });
      setUser(user);
      router.push("/products");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

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

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center text-center">
          <CircleAuth icon={<FaCartShopping />}/>

          <h1 className="mt-5 text-2xl font-semibold md:text-3xl">
            Crie sua conta
          </h1>

          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Cadastre-se para acessar a Voltix e acompanhar suas compras.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 w-full max-w-md px-4 pb-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">Nome</span>
              <input
                className="w-full border-b border-zinc-700 bg-transparent px-1 py-2 text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Seu nome completo"
              />
            </label>

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
                autoComplete="new-password"
                placeholder="Crie uma senha"
              />
            </label>

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
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-green-400 transition hover:text-green-300"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}