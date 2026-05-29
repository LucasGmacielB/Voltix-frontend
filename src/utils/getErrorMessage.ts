import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ??
      "Nao foi possivel concluir a solicitacao. Tente novamente."
    );
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
