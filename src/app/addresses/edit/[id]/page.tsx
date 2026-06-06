"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  buscarEnderecoPorId,
  atualizarEndereco,
} from "@/services/address";

export default function EditAddressPage() {
  const router = useRouter();
  const { id } = useParams();

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await buscarEnderecoPorId(Number(id));

        setStreet(data.street);
        setNumber(data.number);
        setNeighborhood(data.neighborhood);
        setCity(data.city);
        setState(data.state);
        setZipCode(data.zipCode);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar endereço");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await atualizarEndereco(Number(id), {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
      });

      alert("Endereço atualizado com sucesso!");
      router.push("/addresses");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar endereço");
    }
  }

  if (loading) {
    return <p className="text-white p-6">Carregando...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Endereço</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Rua" className="w-full p-2 bg-slate-800" />

        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Número" className="w-full p-2 bg-slate-800" />

        <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bairro" className="w-full p-2 bg-slate-800" />

        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" className="w-full p-2 bg-slate-800" />

        <input value={state} onChange={(e) => setState(e.target.value)} placeholder="Estado" className="w-full p-2 bg-slate-800" />

        <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="CEP" className="w-full p-2 bg-slate-800" />

        <button className="w-full bg-green-600 py-3 rounded">
          Salvar alterações
        </button>
      </form>
    </main>
  );
}