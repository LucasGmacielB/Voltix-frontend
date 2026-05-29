import { create } from "zustand";
import type { UserResponse } from "@/types/auth";

interface AuthStore {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
