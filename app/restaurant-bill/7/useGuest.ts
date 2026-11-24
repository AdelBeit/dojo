import { useEffect, useState, useSyncExternalStore } from "react";
import type { Guest } from "@/lib/restaurant-bill/types";

const cache = new Map<string, Guest>();
const inflight = new Map<string, Promise<Guest>>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
   listeners.add(listener);
   return () => {
      listeners.delete(listener);
   };
}

function notify() {
   listeners.forEach((listener) => listener());
}

class HttpError extends Error {
   constructor(public status: number) {
      super(`HTTP ${status}`);
   }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchGuest(id: string): Promise<Guest> {
   let lastError: Error = new Error("Request failed");
   for (let attempt = 0; attempt < 3; attempt++) {
      try {
         const res = await fetch(`/api/guests/${id}`);
         if (res.ok) return (await res.json()) as Guest;
         throw new HttpError(res.status);
      } catch (e) {
         if (e instanceof HttpError && e.status < 500) throw e;
         lastError = e as Error;
      }
      await sleep(300 * 2 ** attempt);
   }
   throw lastError;
}

function loadGuest(id: string): Promise<Guest> {
   const pending = inflight.get(id);
   if (pending) return pending;
   const promise = fetchGuest(id)
      .then((guest) => {
         cache.set(id, guest);
         notify();
         return guest;
      })
      .finally(() => {
         inflight.delete(id);
      });
   inflight.set(id, promise);
   return promise;
}

// Re-fetches every guest that is already cached (their owed totals may have changed).
export function refreshGuests() {
   for (const id of cache.keys()) {
      fetchGuest(id)
         .then((guest) => {
            cache.set(id, guest);
            notify();
         })
         .catch(() => {});
   }
}

export function useGuest(id: string) {
   const guest = useSyncExternalStore(
      subscribe,
      () => cache.get(id),
      () => undefined,
   );
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (cache.has(id)) return;
      let ignore = false;
      loadGuest(id).catch((e: Error) => {
         if (!ignore) setError(e.message);
      });
      return () => {
         ignore = true;
      };
   }, [id]);

   return { guest, loading: !guest && !error, error };
}
