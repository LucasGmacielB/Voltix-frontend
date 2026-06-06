"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { criarEndereco } from "@/services/address";
import { useRouter } from "next/navigation";

export default function NewAddressPage() {
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      await criarEndereco({
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
        userId: user.id,
      });

      alert("Endereço cadastrado com sucesso!");
      router.push("/addresses");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar endereço.");
    }
  };


  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-green-500 mb-2">
          Novo Endereço
        </h1>

        <p className="text-slate-400 mb-8">
          Cadastre um novo endereço
        </p>

        <form className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">Rua</label>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg p-3"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Número</label>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg p-3"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Bairro</label>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg p-3"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Cidade</label>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg p-3"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Estado</label>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg p-3"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">CEP</label>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg p-3"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-semibold transition"
          >
            Salvar Endereço
          </button>
        </form>
      </div>
    </main>
  );
}