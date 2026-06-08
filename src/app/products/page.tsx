'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { buscarProdutos } from '@/services/product';
import { Logo } from '@/components/logo/Logo';
import { CircleAuth } from '@/components/component-circle-login/CircleAuth';
// Linha 9 corrigida aqui:
import { IoHardwareChipOutline, IoSearchOutline, IoPersonCircleOutline } from "react-icons/io5";

export default function ProductsPage() {
  const [search, setSearch] = useState('');

  const { data: produtos, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: buscarProdutos,
  });

  const produtosFiltrados = produtos?.filter((produto) =>
    produto.name.toLowerCase().includes(search.toLowerCase()) ||
    produto.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-green-500 font-medium animate-pulse">
          Conectando ao banco e carregando catálogo...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-red-500 font-medium">
          Erro ao conectar com o banco de dados.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <section className="relative min-h-[42vh] bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6 py-6 text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-zinc-900 pb-4">
          <Logo />
          
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-300 transition hover:text-green-400 hidden sm:block"
            >
              Dashboard
            </Link>
          
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-zinc-300 hover:text-green-400 transition"
              title="Meu Perfil"
            >
              <IoPersonCircleOutline className="text-2xl" />
              <span className="text-xs font-medium hidden md:inline">Minha Conta</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center text-center">
          <CircleAuth icon={<IoHardwareChipOutline />} />

          <h1 className="mt-4 text-xl font-semibold md:text-3xl text-zinc-300">
            Nossos Equipamentos
          </h1>

          <div className="relative mt-6 w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <IoSearchOutline className="text-lg" />
            </span>
            <input
              type="text"
              placeholder="Buscar produtos ou equipamentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 shadow-lg outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 w-full max-w-5xl px-6 pb-12">
        {produtosFiltrados && produtosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto) => (
              <div 
                key={produto.id} 
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between shadow-2xl transition duration-300 hover:border-zinc-700"
              >
                <div>
                  <div className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-lg mb-4 flex items-center justify-center text-zinc-500 text-sm overflow-hidden">
                    {produto.imgUrl ? (
                      <img src={produto.imgUrl} alt={produto.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span>Sem Imagem Cadastrada</span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-2">{produto.name}</h2>
                  <p className="text-zinc-400 text-xs line-clamp-2 mb-4">{produto.description}</p>
                </div>

                <div>
                  <p className="text-xl font-bold text-green-400 mb-4">
                    {produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <Link 
                    href={`/products/${produto.id}`}
                    className="block text-center w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center shadow-2xl">
            <p className="text-zinc-400 text-sm">Nenhum equipamento encontrado para "{search}".</p>
          </div>
        )}
      </section>
    </main>
  );
}