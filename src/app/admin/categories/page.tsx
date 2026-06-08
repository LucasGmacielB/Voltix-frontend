"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import Link from "next/link";
import { Logo } from "@/components/logo/Logo";

export default function AdminCategoriesPage(){
  const queryClient = useQueryClient();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const{
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.findAll,
  });

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name: string; description: string };
    }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function resetForm(){
    setEditingCategory(null);
    setName("");
    setDescription("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    const data = {
      name,
      description,
    };

    if(editingCategory){
      updateMutation.mutate({
        id: editingCategory.id,
        data,
      });
      return;
    }
    createMutation.mutate(data);
  }

  function handleEdit(category: Category){
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
  }

  function handleDelete(id: number){
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta categoria?"
    );

    if(confirmDelete){
      deleteMutation.mutate(id);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return(
    <main className="min-h-screen bg-zinc-100">
      <section className="relative bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-6 py-6 text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-zinc-800 pb-4">
          <Logo />

          <Link
            href="/categories"
            className="text-sm text-zinc-300 transition hover:text-green-400"
          >
            Ver página pública
          </Link>
        </header>

        <div className="mx-auto mt-12 max-w-6xl pb-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
            Painel administrativo
          </p>

          <h1 className="text-3xl font-semibold text-white md:text-5xl">
            Gerenciar categorias
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Cadastre, edite e remova categorias utilizadas na organização dos
            produtos da Voltix.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 grid max-w-6xl gap-8 px-6 pb-12 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
        >
          <h2 className="mb-5 text-2xl font-semibold text-white">
            {editingCategory ? "Editar categoria" : "Nova categoria"}
          </h2>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">Nome</span>
            <input
              type="text"
              placeholder="Ex: Smartphones"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full border-b border-zinc-700 bg-transparent px-1 py-2 text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
            />
          </label>

          <label className="mt-5 block space-y-2">
            <span className="text-sm font-medium text-zinc-300">
              Descrição
            </span>
            <textarea
              placeholder="Descrição da categoria"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={5}
              className="w-full resize-none border-b border-zinc-700 bg-transparent px-1 py-2 text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-md bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-zinc-600"
          >
            {isSubmitting
              ? "Salvando..."
              : editingCategory
                ? "Atualizar categoria"
                : "Cadastrar categoria"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-3 w-full rounded-md border border-zinc-700 px-4 py-3 font-semibold text-zinc-300 transition hover:border-green-500 hover:text-green-400"
            >
              Cancelar edição
            </button>
          )}
        </form>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">
              Categorias cadastradas
            </h2>

            <span className="rounded-full bg-green-600 px-4 py-1 text-sm font-semibold text-white">
              {categories?.length || 0} itens
            </span>
          </div>

          {isLoading && <p className="text-zinc-300">Carregando...</p>}

          {isError && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              Erro ao carregar categorias. Verifique se o backend está rodando.
            </p>
          )}

          {!isLoading && categories?.length === 0 && (
            <p className="text-zinc-300">Nenhuma categoria cadastrada.</p>
          )}

          <div className="space-y-4">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-green-500 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-400">
                    {category.description}
                  </p>

                  <p className="mt-2 text-xs text-zinc-500">
                    ID: {category.id}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-green-500 hover:text-green-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}