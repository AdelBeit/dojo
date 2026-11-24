import { useEffect, useState } from "react";
import type { Guest } from "@/lib/restaurant-bill/types";

const cache = new Map<string, Guest>();
const inflight = new Map<string, Promise<Guest>>();

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
         return guest;
      })
      .finally(() => {
         inflight.delete(id);
      });
   inflight.set(id, promise);
   return promise;
}

export function useGuest(id: string) {
   const [, rerender] = useState(0);
   const [error, setError] = useState<string | null>(null);
   const guest = cache.get(id);

   useEffect(() => {
      if (cache.has(id)) return;
      let ignore = false;
      loadGuest(id)
         .then(() => {
            if (!ignore) rerender((n) => n + 1);
         })
         .catch((e: Error) => {
            if (!ignore) setError(e.message);
         });
      return () => {
         ignore = true;
      };
   }, [id]);

   return { guest, loading: !guest && !error, error };
}
