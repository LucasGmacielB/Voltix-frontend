"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IoAddCircle, IoLocationSharp } from "react-icons/io5";

import { buscarEnderecos, excluirEndereco } from "@/services/address";
import { useAuthStore } from "@/store/useAuthStore";

export default function AddressesPage() {
  const router = useRouter();
  const basicAuth = useAuthStore((state) => state.basicAuth);

  const {
    data: enderecos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => buscarEnderecos(basicAuth!),
    enabled: !!basicAuth,
  });

  async function handleDelete(id?: number) {
    if (!id) {
      alert("ID do endereço inválido.");
      return;
    }

    const confirmar = confirm("Deseja excluir este endereço?");

    if (!confirmar) return;

    if (!basicAuth) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      await excluirEndereco(id, basicAuth);
      alert("Endereço excluído com sucesso!");
      await refetch();
    } catch {
      alert("Erro ao excluir endereço.");
    }
  }

  if (!basicAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Usuário não autenticado.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Carregando endereços...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-red-500">
        Erro ao carregar os endereços.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-500">Endereços</h1>

            <p className="mt-2 text-slate-400">
              Gerencie seus endereços cadastrados
            </p>
          </div>

          <button
            onClick={() => router.push("/addresses/new")}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-500"
          >
            <IoAddCircle size={22} />
            Novo Endereço
          </button>
        </div>

        {enderecos?.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">Nenhum endereço cadastrado.</p>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          {enderecos?.map((endereco) => (
            <div
              key={endereco.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <IoLocationSharp size={28} className="text-green-500" />

                <h2 className="text-xl font-semibold">
                  {endereco.street}, {endereco.number}
                </h2>
              </div>

              <div className="space-y-2 text-slate-300">
                <p>
                  <span className="text-slate-500">Bairro:</span>{" "}
                  {endereco.neighborhood}
                </p>

                <p>
                  <span className="text-slate-500">Cidade:</span>{" "}
                  {endereco.city}
                </p>

                <p>
                  <span className="text-slate-500">Estado:</span>{" "}
                  {endereco.state}
                </p>

                <p>
                  <span className="text-slate-500">CEP:</span>{" "}
                  {endereco.zipCode}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => router.push(`/addresses/edit/${endereco.id}`)}
                  className="flex-1 rounded-lg bg-slate-800 py-2 transition hover:bg-slate-700"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(endereco.id)}
                  className="flex-1 rounded-lg bg-red-600 py-2 transition hover:bg-red-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}