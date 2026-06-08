import { api } from "./api";
import { Category, CategoryRequest } from "@/types/category";

export const categoryService = {
  async findAll(): Promise<Category[]> {
    const response = await api.get<Category[]>("/api/categories");
    return response.data;
  },

  async findById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/api/categories/${id}`);
    return response.data;
  },

  async create(data: CategoryRequest): Promise<Category> {
    const response = await api.post<Category>("/api/categories", data);
    return response.data;
  },

  async update(id: number, data: CategoryRequest): Promise<Category> {
    const response = await api.put<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },
};