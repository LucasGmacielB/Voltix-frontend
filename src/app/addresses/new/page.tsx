"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { criarEndereco } from "@/services/address";
import { useAuthStore } from "@/store/useAuthStore";

export default function NewAddressPage() {
  const router = useRouter();
  const basicAuth = useAuthStore((state) => state.basicAuth);

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!basicAuth) {
      alert("Usuário não autenticado.");
      router.push("/login");
      return;
    }

    if (
      !street.trim() ||
      !number.trim() ||
      !neighborhood.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zipCode.trim()
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await criarEndereco(
        {
          street,
          number,
          neighborhood,
          city,
          state,
          zipCode,
        },
        basicAuth
      );

      alert("Endereço cadastrado com sucesso!");
      router.push("/addresses");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar endereço.");
    }
  }

  if (!basicAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Usuário não autenticado.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-2 text-4xl font-bold text-green-500">
          Novo Endereço
        </h1>

        <p className="mb-8 text-slate-400">Cadastre um novo endereço</p>

        <form
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-2 block">Rua</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block">Número</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block">Bairro</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block">Cidade</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block">Estado</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block">CEP</label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/addresses")}
              className="flex-1 rounded-lg bg-slate-800 py-3 font-semibold transition hover:bg-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-green-600 py-3 font-semibold transition hover:bg-green-500"
            >
              Salvar Endereço
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}