import { create } from "zustand";
import axios from "axios";

const useRoomStore = create((set) => ({
  rooms: [],
  loading: false,
  error: null,

  fetchRooms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/rooms");
      set({ rooms: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch rooms", loading: false });
    }
  },

  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/rooms", roomData);
      set((state) => ({ rooms: [...state.rooms, response.data], loading: false }));
    } catch (error) {
      set({ error: error.message || "Failed to create room", loading: false });
    }
  },

  updateRoom: async (roomId, roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/rooms/${roomId}`, roomData);
      set((state) => ({
        rooms: state.rooms.map((room) => (room._id === roomId ? response.data : room)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || "Failed to update room", loading: false });
    }
  },

  deleteRoom: async (roomId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/rooms/${roomId}`);
      set((state) => ({
        rooms: state.rooms.filter((room) => room._id !== roomId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || "Failed to delete room", loading: false });
    }
  },
}));

export default useRoomStore;
