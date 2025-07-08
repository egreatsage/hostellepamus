import { create } from "zustand";
import { getSession, signOut } from "next-auth/react";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  fetchUser: async () => {
    set({ loading: true });
    const session = await getSession();
    set({ user: session && session.user ? session.user : null, loading: false });
  },
  logout: async () => {
    await signOut({ redirect: false });
    set({ user: null });
  },
}));

export default useAuthStore;
