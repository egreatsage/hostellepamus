import { create } from "zustand";

const useRegisterStore = create((set) => ({
  isLoading: false,
  errorMessage: "",
  setLoading: (loading) => set({ isLoading: loading }),
  setErrorMessage: (message) => set({ errorMessage: message }),
}));

export default useRegisterStore;
