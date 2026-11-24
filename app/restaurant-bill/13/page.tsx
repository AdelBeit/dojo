"use client";

import { useEffect, useRef, useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { AppStateProvider, useAppState } from "./context-state";
import { ItemList, type PaidFilter, type SortKey } from "./ItemList";
import { Providers } from "./providers";
import { Toasts } from "./Toasts";
import { useDebouncedValue } from "./useDebouncedValue";
// ## 1.13
// Starring on the full list of 400 items feels laggy. Separately, a plain function outside React (say, the code that handles a failed request) needs to show a toast and know the current theme. Rework where the state lives, and try two different approaches. Be ready to say when you'd keep what you had.

function Bills() {
   const [search, setSearch] = useState("");
   const [paidFilter, setPaidFilter] = useState<PaidFilter>("all");
   const [sort, setSort] = useState<SortKey>("default");
   const searchRef = useRef<HTMLInputElement>(null);
   const debouncedSearch = useDebouncedValue(search, 250);
   const { state, dispatch } = useAppState();

   useEffect(() => {
      searchRef.current?.focus();
   }, []);

   return (
      <div
         className={`min-h-screen ${state.theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-white text-neutral-900"}`}
      >
         <main className="mx-auto w-full max-w-md px-4 py-10">
            <h1 className="mb-6">Restaurant bills</h1>
            <div className="flex flex-col gap-3">
               <div className="flex gap-2">
                  <button
                     type="button"
                     onClick={() => dispatch({ type: "setTheme", theme: state.theme === "dark" ? "light" : "dark" })}
                  >
                     {state.theme === "dark" ? "Light theme" : "Dark theme"}
                  </button>
                  <button
                     type="button"
                     aria-expanded={state.filterOpen}
                     onClick={() => dispatch({ type: "toggleFilter" })}
                  >
                     {state.filterOpen ? "Hide filters" : "Show filters"}
                  </button>
               </div>
               {state.filterOpen && (
                  <div className="flex flex-col gap-1 rounded-lg border border-current/20 p-4">
                     <label htmlFor="paid-filter" className="flex flex-col gap-1 text-sm">
                        Status
                        <select
                           id="paid-filter"
                           value={paidFilter}
                           onChange={(e) => setPaidFilter(e.target.value as PaidFilter)}
                        >
                           <option value="all">All</option>
                           <option value="paid">Paid</option>
                           <option value="unpaid">Unpaid</option>
                        </select>
                     </label>
                  </div>
               )}
               <AddItemForm />
               <input
                  ref={searchRef}
                  placeholder="search items"
                  className="w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
               <select aria-label="Sort items" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="default">Default order</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                  <option value="name">Name</option>
               </select>
               <ItemList search={debouncedSearch} paidFilter={paidFilter} sort={sort} />
            </div>
         </main>
         <Toasts />
      </div>
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
