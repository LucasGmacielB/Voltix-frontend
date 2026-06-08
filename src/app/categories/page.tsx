"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import Link from "next/link";
import { Logo } from "@/components/logo/Logo";

export default function CategoriesPage() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.findAll,
  });

  return (
    <main className="min-h-screen bg-zinc-100">
      <section className="relative bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6 py-6 text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />

          <Link
            href="/admin/categories"
            className="text-sm text-zinc-300 transition hover:text-green-400"
          >
            Gerenciar categorias
          </Link>
        </header>

        <div className="mx-auto mt-12 max-w-6xl pb-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            Voltix Store
          </p>

          <h1 className="text-3xl font-semibold text-white md:text-5xl">
            Categorias de produtos
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Explore as categorias disponíveis na Voltix e encontre produtos de
            tecnologia organizados de forma simples e rápida.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-6 pb-12">
        {isLoading && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300 shadow-2xl">
            Carregando categorias...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400 shadow-2xl">
            Erro ao carregar categorias. Verifique se o backend está rodando.
          </div>
        )}

        {!isLoading && categories?.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300 shadow-2xl">
            Nenhuma categoria cadastrada ainda.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href="/products"
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl transition hover:-translate-y-1 hover:border-green-500"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                {category.name.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-xl font-semibold text-white">
                {category.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {category.description || "Sem descrição cadastrada."}
              </p>

              <p className="mt-5 text-sm font-semibold text-green-400">
                Ver produtos
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}