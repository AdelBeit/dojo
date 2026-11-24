"use client";

import { useEffect, useRef, useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { ItemList, type PaidFilter, type SortKey } from "./ItemList";
import { Providers } from "./providers";
import { AppStateProvider } from "./state";
import { useDebouncedValue } from "./useDebouncedValue";
// ## 1.12
// Let users star items, choose a light or dark theme, and open and close a filter panel. Stars and theme should survive a reload.

function Bills() {
   const [search, setSearch] = useState("");
   const [paidFilter, setPaidFilter] = useState<PaidFilter>("all");
   const [sort, setSort] = useState<SortKey>("default");
   const searchRef = useRef<HTMLInputElement>(null);
   const debouncedSearch = useDebouncedValue(search, 250);
   // TODO: your code goes here

   useEffect(() => {
      searchRef.current?.focus();
   }, []);

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Restaurant bills</h1>
         <div className="flex flex-col gap-3">
            {/* TODO: your code goes here */}
            <AddItemForm />
            <input
               ref={searchRef}
               placeholder="search items"
               className="w-full"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
            <select
               aria-label="Sort items"
               value={sort}
               onChange={(e) => setSort(e.target.value as SortKey)}
            >
               <option value="default">Default order</option>
               <option value="price-asc">Price, low to high</option>
               <option value="price-desc">Price, high to low</option>
               <option value="name">Name</option>
            </select>
            <ItemList search={debouncedSearch} paidFilter={paidFilter} sort={sort} />
         </div>
      </main>
   );
}

export default function Page() {
   return (
      <Providers>
         <AppStateProvider>
            <Bills />
         </AppStateProvider>
      </Providers>
   );
}
