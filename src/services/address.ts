import { api } from "@/services/api";
import type { Address, CreateAddress, UpdateAddress } from "@/types/address";

function authHeader(basicAuth: string) {
  return {
    headers: {
      Authorization: basicAuth,
    },
  };
}

export async function buscarEnderecos(basicAuth: string): Promise<Address[]> {
  const response = await api.get<Address[]>("/addresses", authHeader(basicAuth));
  return response.data;
}

export async function buscarEnderecoPorId(
  id: number,
  basicAuth: string
): Promise<Address> {
  const response = await api.get<Address>(
    `/addresses/${id}`,
    authHeader(basicAuth)
  );

  return response.data;
}

export async function criarEndereco(
  endereco: CreateAddress,
  basicAuth: string
): Promise<Address> {
  const response = await api.post<Address>(
    "/addresses",
    endereco,
    authHeader(basicAuth)
  );

  return response.data;
}

export async function atualizarEndereco(
  id: number,
  endereco: UpdateAddress,
  basicAuth: string
): Promise<Address> {
  const response = await api.put<Address>(
    `/addresses/${id}`,
    endereco,
    authHeader(basicAuth)
  );

  return response.data;
}

export async function excluirEndereco(
  id: number,
  basicAuth: string
): Promise<void> {
  await api.delete(`/addresses/${id}`, authHeader(basicAuth));
}