"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IoLocationSharp, IoAddCircle } from "react-icons/io5";

import { buscarEnderecos } from "@/services/address";

export default function AddressesPage() {
  const router = useRouter();

  const {
    data: enderecos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: buscarEnderecos,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Carregando endereços...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-red-500 flex items-center justify-center">
        Erro ao carregar os endereços.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-green-500">
              Endereços
            </h1>

            <p className="text-slate-400 mt-2">
              Gerencie seus endereços cadastrados
            </p>
          </div>

          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl font-semibold transition"
          >
            <IoAddCircle size={22} />
            Novo Endereço
          </button>
        </div>

        {enderecos?.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-slate-400">
              Nenhum endereço cadastrado.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {enderecos?.map((endereco) => (
            <div
              key={endereco.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <IoLocationSharp
                  size={28}
                  className="text-green-500"
                />

                <h2 className="text-xl font-semibold">
                  {endereco.street}, {endereco.number}
                </h2>
              </div>

              <div className="space-y-2 text-slate-300">
                <p>
                  <span className="text-slate-500">
                    Bairro:
                  </span>{" "}
                  {endereco.neighborhood}
                </p>

                <p>
                  <span className="text-slate-500">
                    Cidade:
                  </span>{" "}
                  {endereco.city}
                </p>

                <p>
                  <span className="text-slate-500">
                    Estado:
                  </span>{" "}
                  {endereco.state}
                </p>

                <p>
                  <span className="text-slate-500">
                    CEP:
                  </span>{" "}
                  {endereco.zipCode}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg transition"
                >
                  Editar
                </button>

                <button
                  className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg transition"
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