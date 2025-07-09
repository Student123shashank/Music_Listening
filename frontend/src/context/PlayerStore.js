import { create } from 'zustand';

const usePlayerStore = create((set) => ({
  currentSong: null,
  queue: [],
  setCurrentSong: (song) => set({ currentSong: song }),
  setQueue: (songs) => set({ queue: songs }),
}));

// Export the hook
export const usePlayer = () => {
  const { currentSong, queue, setCurrentSong, setQueue } = usePlayerStore();
  return { currentSong, queue, setCurrentSong, setQueue };
};

// Optional: Export the store directly if needed elsewhere
export default usePlayerStore;