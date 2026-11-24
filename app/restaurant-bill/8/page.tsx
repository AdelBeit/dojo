"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "./ItemCard";
import { refreshGuests } from "./useGuest";
import type { Item } from "@/lib/restaurant-bill/types";

type Status = "loading" | "error" | "success";

export default function Page() {
   const [items, setItems] = useState<Item[]>([]);
   const [status, setStatus] = useState<Status>("loading");
   const [error, setError] = useState("");
   // TODO: your code goes here
   useEffect(() => {
      let ignore = false;
      async function fetchItems(initial: boolean) {
         try {
            const res = await fetch("/api/items?limit=60");
            if (!res.ok) {
               const body = await res.json().catch(() => null);
               throw new Error(body?.error ?? `Request failed (HTTP ${res.status})`);
            }
            const data: Item[] = await res.json();
            if (!ignore) {
               setItems(data);
               setStatus("success");
            }
         } catch (e) {
            // a failed background refresh keeps the list on screen
            if (!ignore && initial) {
               setError(e instanceof Error ? e.message : "Something went wrong");
               setStatus("error");
            }
         }
      }
      fetchItems(true);
      const timer = setInterval(() => {
         fetchItems(false);
         refreshGuests();
      }, 10_000);
      return () => {
         ignore = true;
         clearInterval(timer);
      };
   }, []);

   async function markPaid(id: string) {
      const res = await fetch(`/api/items/${id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ paid: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated: Item = await res.json();
      setItems((list) => list.map((i) => (i.id === id ? updated : i)));
      refreshGuests();
   }

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Restaurant bills</h1>
         <div className="flex flex-col gap-3">
            {status === "loading" && <p>Loading...</p>}
            {status === "error" && <p role="alert">There was an error fetching items: {error}</p>}
            {status === "success" && items.map(item => {
               return <ItemCard key={item.id} item={item} onMarkPaid={markPaid} />
            })}
         </div>
      </main>
   )
}
