"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";

export type Theme = "light" | "dark";

type State = {
   stars: Record<string, true>;
   theme: Theme;
   filterOpen: boolean;
   hydrated: boolean;
};

type Action =
   | { type: "hydrate"; stars: Record<string, true>; theme: Theme }
   | { type: "toggleStar"; id: string }
   | { type: "setTheme"; theme: Theme }
   | { type: "toggleFilter" };

const STARS_KEY = "rb-stars";
const THEME_COOKIE = "rb-theme";

const initialState: State = { stars: {}, theme: "light", filterOpen: false, hydrated: false };

function reducer(state: State, action: Action): State {
   switch (action.type) {
      case "hydrate":
         return { ...state, stars: action.stars, theme: action.theme, hydrated: true };
      case "toggleStar": {
         const stars = { ...state.stars };
         if (stars[action.id]) delete stars[action.id];
         else stars[action.id] = true;
         return { ...state, stars };
      }
      case "setTheme":
         return { ...state, theme: action.theme };
      case "toggleFilter":
         return { ...state, filterOpen: !state.filterOpen };
   }
}

function readStars(): Record<string, true> {
   try {
      const raw = localStorage.getItem(STARS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, true>) : {};
   } catch {
      return {};
   }
}

function readTheme(): Theme {
   const match = document.cookie.split("; ").find((c) => c.startsWith(`${THEME_COOKIE}=`));
   return match?.split("=")[1] === "dark" ? "dark" : "light";
}

const StateContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
   const [state, dispatch] = useReducer(reducer, initialState);

   // localStorage and cookies only exist in the browser, so load them after mount.
   useEffect(() => {
      dispatch({ type: "hydrate", stars: readStars(), theme: readTheme() });
   }, []);

   useEffect(() => {
      if (!state.hydrated) return;
      try {
         localStorage.setItem(STARS_KEY, JSON.stringify(state.stars));
      } catch {
         // storage can be full or blocked, stars just will not persist
      }
   }, [state.hydrated, state.stars]);

   useEffect(() => {
      if (!state.hydrated) return;
      document.cookie = `${THEME_COOKIE}=${state.theme}; path=/; max-age=31536000; samesite=lax`;
   }, [state.hydrated, state.theme]);

   const value = useMemo(() => ({ state, dispatch }), [state]);
   return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
   const value = useContext(StateContext);
   if (!value) throw new Error("useAppState must be used inside AppStateProvider");
   return value;
}
