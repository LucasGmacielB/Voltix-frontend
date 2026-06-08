'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { buscarProdutos } from '@/services/product';
import { Logo } from '@/components/logo/Logo';
import { CircleAuth } from '@/components/component-circle-login/CircleAuth';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { useCartStore } from '@/store/useCartStore';
import { IoHardwareChipOutline, IoSearchOutline, IoPersonCircleOutline, IoCartOutline } from "react-icons/io5";

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

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
            {/* Link do Carrinho */}
            <Link 
              href="/cart" 
              className="relative flex items-center gap-2 text-zinc-300 hover:text-green-400 transition"
              title="Carrinho de Compras"
            >
              <IoCartOutline className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-black">
                  {totalItems}
                </span>
              )}
              <span className="text-xs font-medium hidden md:inline">Carrinho</span>
            </Link>

            {/* Ícone de Perfil Atualizado Aqui */}
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

      {/* O restante do arquivo (seção de conteúdo) permanece igual */}
      <section className="relative z-10 mx-auto -mt-10 w-full max-w-5xl px-6 pb-12">
        {produtosFiltrados && produtosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto) => (
              <ProductCard key={produto.id} product={produto} />
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