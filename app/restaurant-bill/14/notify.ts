import { useAppStore } from "./zustand-store";

// Plain function: callable from mutation callbacks and other code outside React.
export function notify(message: string): { theme: "light" | "dark" } {
   const { theme, addToast } = useAppStore.getState();
   addToast(message);
   return { theme };
}
