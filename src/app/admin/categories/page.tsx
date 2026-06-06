"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import Link from "next/link";

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
    mutationFn: ({ id, data }: { id: number; data: { name: string; description: string } }) =>
      categoryService.update(id, data),
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

    if (editingCategory){
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
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Painel administrativo
            </p>
            <h1 className="text-4xl font-bold">Gerenciar categorias</h1>
            <p className="mt-3 text-slate-300">
              Cadastre, edite e remova categorias utilizadas na loja Voltix.
            </p>
          </div>

          <Link
            href="/categories"
            className="rounded-xl border border-cyan-400 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
          >
            Ver página pública
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
          >
            <h2 className="mb-5 text-2xl font-bold">
              {editingCategory ? "Editar categoria" : "Nova categoria"}
            </h2>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Nome
            </label>
            <input
              type="text"
              placeholder="Ex: Smartphones"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Descrição
            </label>
            <textarea
              placeholder="Descrição da categoria"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={5}
              className="mb-5 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="mt-3 w-full rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-300 transition hover:bg-slate-800"
              >
                Cancelar edição
              </button>
            )}
          </form>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Categorias cadastradas</h2>
              <span className="rounded-full bg-cyan-500/20 px-4 py-1 text-sm font-bold text-cyan-300">
                {categories?.length || 0} itens
              </span>
            </div>

            {isLoading && <p className="text-slate-300">Carregando...</p>}

            {isError && (
              <p className="text-red-300">
                Erro ao carregar categorias. Verifique o backend.
              </p>
            )}

            {!isLoading && categories?.length === 0 && (
              <p className="text-slate-300">Nenhuma categoria cadastrada.</p>
            )}

            <div className="space-y-4">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-950 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">
                      {category.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      ID: {category.id}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400 disabled:opacity-60"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}