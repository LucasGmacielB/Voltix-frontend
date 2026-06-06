import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  basicAuth: string | null;
  setUser: (user: User) => void;
  setAuth: (user: User, password: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      basicAuth: null,

      setUser: (user) => set({ user }),

      setAuth: (user, password) => {
        const token = btoa(`${user.email}:${password}`);

        set({
          user,
          basicAuth: `Basic ${token}`,
        });
      },

      logout: () =>
        set({
          user: null,
          basicAuth: null,
        }),
    }),
    {
      name: "voltix-auth",
    }
  )
);