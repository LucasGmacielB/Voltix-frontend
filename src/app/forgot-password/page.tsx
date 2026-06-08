"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { forgotPassword } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Logo } from "@/components/logo/Logo";
import { MdOutlineVpnKey } from "react-icons/md";
import { CircleAuth } from "@/components/component-circle-login/CircleAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Preencha o email.");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
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
          <CircleAuth icon={<MdOutlineVpnKey />}/>

          <h1 className="mt-5 text-2xl font-semibold md:text-3xl">
            Recupere sua senha
          </h1>

          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Informe o e-mail cadastrado para receber as instruções de
            redefinição de senha.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 w-full max-w-md px-4 pb-10">
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
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instruções"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Lembrou sua senha?{" "}
            <Link
              href="/login"
              className="font-medium text-green-400 transition hover:text-green-300"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}