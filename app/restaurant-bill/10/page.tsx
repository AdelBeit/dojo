"use client";

import { useEffect, useRef, useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { ItemList, type PaidFilter, type SortKey } from "./ItemList";
import { Providers } from "./providers";
import { useDebouncedValue } from "./useDebouncedValue";
// ## 1.10
// Add a form that adds an item to the tab: `POST /api/items` with `{ guestId, name, priceCents }`. The new item should show up instantly. If the request fails (`POST /api/items?d=fail`), the user must be able to tell what happened and what state the list is in.

function Bills() {
   const [search, setSearch] = useState("");
   const [paidFilter, setPaidFilter] = useState<PaidFilter>("all");
   const [sort, setSort] = useState<SortKey>("default");
   const searchRef = useRef<HTMLInputElement>(null);
   const debouncedSearch = useDebouncedValue(search, 250);

   useEffect(() => {
      searchRef.current?.focus();
   }, []);

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Restaurant bills</h1>
         <div className="flex flex-col gap-3">
            <AddItemForm />
            <input
               ref={searchRef}
               placeholder="search items"
               className="w-full"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
               <select
                  aria-label="Filter by status"
                  className="flex-1"
                  value={paidFilter}
                  onChange={(e) => setPaidFilter(e.target.value as PaidFilter)}
               >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
               </select>
               <select
                  aria-label="Sort items"
                  className="flex-1"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
               >
                  <option value="default">Default order</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                  <option value="name">Name</option>
               </select>
            </div>
            <ItemList search={debouncedSearch} paidFilter={paidFilter} sort={sort} />
         </div>
      </main>
   );
}

export default function Page() {
   return (
      <Providers>
         <Bills />
      </Providers>
   );
}
