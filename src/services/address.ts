import { api } from "@/services/api";

export interface Address {
  id?: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  userId: number;
}

export async function buscarEnderecos(): Promise<Address[]> {
  const response = await api.get<Address[]>("/addresses");
  return response.data;
}

export async function buscarEnderecoPorId(
  id: number,
): Promise<Address> {
  const response = await api.get<Address>(
    `/addresses/${id}`,
  );

    return response.data;


}

export async function criarEndereco(
  endereco: Address,
): Promise<Address> {
  const response = await api.post<Address>(
    "/addresses",
    endereco,
  );

  return response.data;
}

export async function atualizarEndereco(
  id: number,
  endereco: Address,
): Promise<Address> {
  const response = await api.put<Address>(
    `/addresses/${id}`,
    endereco,
  );

    return response.data;

}

export async function excluirEndereco(id: number): Promise<void> {
  await api.delete(`/addresses/${id}`);
}
