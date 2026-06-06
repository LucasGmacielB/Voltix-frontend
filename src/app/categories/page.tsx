"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import Link from "next/link";

export default function CategoriesPage(){
  const{
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.findAll,
  });

  return(
    <main className="min-h-screen bg-[#0f172a] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Voltix Store
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">
              Categorias de produtos
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Explore as principais categorias da nossa loja de eletrônicos e
              encontre os produtos ideais para o seu dia a dia.
            </p>
          </div>

          <Link
            href="/admin/categories"
            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Gerenciar categorias
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-2xl bg-slate-900 p-8 text-slate-300">
            Carregando categorias...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-red-300">
            Erro ao carregar categorias. Verifique se o backend está rodando.
          </div>
        )}

        {!isLoading && categories?.length === 0 && (
          <div className="rounded-2xl bg-slate-900 p-8 text-slate-300">
            Nenhuma categoria cadastrada ainda.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition hover:-translate-y-1 hover:border-cyan-400"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-xl font-bold text-cyan-300">
                {category.name.charAt(0).toUpperCase()}
              </div>

              <h2 className="mb-2 text-2xl font-bold">{category.name}</h2>

              <p className="text-sm leading-6 text-slate-300">
                {category.description || "Sem descrição cadastrada."}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}