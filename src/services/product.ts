import { api } from "@/services/api";
import type { Product } from "@/types/product";

// Busca todos os produtos para listar na Home da Vitrine
export async function buscarProdutos(): Promise<Product[]> {
  const response = await api.get<Product[]>("/api/products");
  return response.data;
}

// Busca os detalhes de um produto específico usando o ID da URL
export async function buscarProdutoPorId(id: number): Promise<Product> {
  const response = await api.get<Product>(`/api/products/${id}`);
  return response.data;
}