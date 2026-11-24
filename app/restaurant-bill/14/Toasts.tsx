import { useAppStore } from "./zustand-store";

export function Toasts() {
   const toasts = useAppStore((s) => s.toasts);
   const dismissToast = useAppStore((s) => s.dismissToast);
   return (
      <div className="fixed bottom-4 left-1/2 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
         {toasts.map((toast) => (
            <div
               key={toast.id}
               role="status"
               className={`flex items-center justify-between gap-2 rounded-lg px-4 py-2 text-sm ${
                  toast.theme === "dark" ? "bg-neutral-100 text-neutral-900" : "bg-neutral-900 text-neutral-100"
               }`}
            >
               <span>{toast.message}</span>
               <button type="button" aria-label="Dismiss" onClick={() => dismissToast(toast.id)}>
                  ×
               </button>
            </div>
         ))}
      </div>
   );
}
