'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { buscarProdutoPorId } from '@/services/product';
import { Logo } from '@/components/logo/Logo';
import { CircleAuth } from '@/components/component-circle-login/CircleAuth';
import { useCartStore } from '@/store/useCartStore';
import { IoEyeOutline, IoCartOutline } from "react-icons/io5";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleAddToCart = () => {
    if (produto) {
      addItem(produto, 1);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1500);
    }
  };

  const { data: produto, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => buscarProdutoPorId(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-green-500 font-medium animate-pulse">Buscando especificações...</p>
      </div>
    );
  }

  if (isError || !produto) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Produto não localizado no banco.</p>
        <button onClick={() => router.push('/products')} className="text-green-400 hover:underline text-sm">
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Seção Superior - Igual ao Estilo de Login */}
      <section className="relative min-h-[38vh] bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6 py-6 text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
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
            </Link>
            <button
              onClick={() => router.push('/products')}
              className="text-sm text-zinc-300 transition hover:text-green-400"
            >
              Voltar ao Catálogo
            </button>
          </div>
        </header>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center text-center">
          <CircleAuth icon={<IoEyeOutline />} />

          <h1 className="mt-5 text-xl font-semibold md:text-3xl text-zinc-300">
            Ficha do Equipamento
          </h1>
        </div>
      </section>

      {/* Caixa de detalhes seguindo a largura e o visual do Card de Login */}
      <section className="relative z-10 mx-auto -mt-10 w-full max-w-2xl px-6 pb-12">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 border border-zinc-800 w-full aspect-square rounded-lg flex items-center justify-center text-zinc-600 text-sm overflow-hidden">
              {produto.imgUrl ? (
                <img src={produto.imgUrl} alt={produto.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span>Visualização Técnica</span>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{produto.name}</h2>
                <p className="text-zinc-400 text-xs leading-relaxed">{produto.description}</p>
              </div>

              <div className="mt-6 border-t border-zinc-800 pt-4">
                <span className="text-xs text-zinc-500 block mb-1">Preço unitário</span>
                <p className="text-2xl font-extrabold text-green-400 mb-4">
                  {produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full rounded-md px-4 py-2.5 font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-green-600 hover:bg-green-500 active:scale-95'
                  }`}
                >
                  {added ? 'Adicionado ao Carrinho! ⚡' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}