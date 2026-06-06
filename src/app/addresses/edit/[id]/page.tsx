"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { atualizarEndereco, buscarEnderecoPorId } from "@/services/address";
import { useAuthStore } from "@/store/useAuthStore";

export default function EditAddressPage() {
  const router = useRouter();

  const params = useParams();
  const id = Number(params?.id);
  const basicAuth = useAuthStore((state) => state.basicAuth);

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!basicAuth) {
        alert("Usuário não autenticado.");
        router.push("/login");
        return;
      }

      if (!id || Number.isNaN(id)) {
        alert("ID do endereço inválido.");
        router.push("/addresses");
        return;
      }

      try {
        const data = await buscarEnderecoPorId(id, basicAuth);

        setStreet(data.street);
        setNumber(data.number);
        setNeighborhood(data.neighborhood);
        setCity(data.city);
        setState(data.state);
        setZipCode(data.zipCode);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar endereço.");
        router.push("/addresses");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, basicAuth, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!basicAuth) {
      alert("Usuário não autenticado.");
      router.push("/login");
      return;
    }

    if (!id || Number.isNaN(id)) {
      alert("ID do endereço inválido.");
      router.push("/addresses");
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
      await atualizarEndereco(
        id,
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

      alert("Endereço atualizado com sucesso!");
      router.push("/addresses");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar endereço.");
    }
  }

  if (!basicAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Usuário não autenticado.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Carregando endereço...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-2 text-4xl font-bold text-green-500">
          Editar Endereço
        </h1>

        <p className="mb-8 text-slate-400">
          Atualize as informações do endereço selecionado
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div>
            <label className="mb-2 block">Rua</label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Rua"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block">Número</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Número"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block">Bairro</label>
            <input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Bairro"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block">Cidade</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cidade"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block">Estado</label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Estado"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block">CEP</label>
            <input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="CEP"
              className="w-full rounded-lg bg-slate-800 p-3 outline-none transition focus:ring-2 focus:ring-green-500"
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
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}