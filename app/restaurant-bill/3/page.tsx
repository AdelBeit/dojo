"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "./ItemCard";
import type { Item } from "@/lib/restaurant-bill/types";
// ## 1.3
// Same page and the same URL, but now the request fails (`/api/items?limit=60&d=fail`). Handle it so the user knows what happened.

export default function Page() {
   const [items, setItems] = useState<Item[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   // TODO: your code goes here
   useEffect(() => {
      let ignore = false;
      async function fetchItems() {
         try {
            const res = await fetch("/api/items?limit=60&d=fail");
            if (!res.ok) throw new Error("couldn't fetch items");
            const data: Item[] = await res.json();
            if (!ignore) setItems(data);
         } catch (e) {
            console.error(e);
            // TODO: your code goes here
         } finally {
            if (!ignore) setIsLoading(false);
         }
      }
      fetchItems();
      return () => {
         ignore = true;
      };
   }, []);

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Restaurant bills</h1>
         <div className="flex flex-col gap-3">
            {/* TODO: your code goes here */}
            {isLoading ? <p>Loading...</p> : items.map(item => {
               return <ItemCard key={item.id} item={item} />
            })}
         </div>
      </main>
   )
}
