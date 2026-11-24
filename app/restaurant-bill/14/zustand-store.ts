import { create } from "zustand";

export type Theme = "light" | "dark";
export type Toast = { id: number; message: string; theme: Theme };

type AppStore = {
   stars: Record<string, true>;
   theme: Theme;
   filterOpen: boolean;
   toasts: Toast[];
   hydrate: () => void;
   toggleStar: (id: string) => void;
   setTheme: (theme: Theme) => void;
   toggleFilter: () => void;
   addToast: (message: string) => void;
   dismissToast: (id: number) => void;
};

const STARS_KEY = "rb-stars";
const THEME_COOKIE = "rb-theme";

function saveStars(stars: Record<string, true>) {
   try {
      localStorage.setItem(STARS_KEY, JSON.stringify(stars));
   } catch {
      // storage can be full or blocked, stars just will not persist
   }
}

let nextToastId = 1;

export const useAppStore = create<AppStore>((set, get) => ({
   stars: {},
   theme: "light",
   filterOpen: false,
   toasts: [],

   // localStorage and cookies only exist in the browser, so call this after mount.
   hydrate: () => {
      let stars: Record<string, true> = {};
      try {
         const raw = localStorage.getItem(STARS_KEY);
         if (raw) stars = JSON.parse(raw) as Record<string, true>;
      } catch {
         stars = {};
      }
      const match = document.cookie.split("; ").find((c) => c.startsWith(`${THEME_COOKIE}=`));
      set({ stars, theme: match?.split("=")[1] === "dark" ? "dark" : "light" });
   },

   toggleStar: (id) => {
      const stars = { ...get().stars };
      if (stars[id]) delete stars[id];
      else stars[id] = true;
      saveStars(stars);
      set({ stars });
   },

   setTheme: (theme) => {
      document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
      set({ theme });
   },

   toggleFilter: () => set((state) => ({ filterOpen: !state.filterOpen })),

   addToast: (message) => {
      const id = nextToastId++;
      set((state) => ({ toasts: [...state.toasts, { id, message, theme: state.theme }] }));
      setTimeout(() => get().dismissToast(id), 4000);
   },

   dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
