"use client";

import { useEffect, useRef, useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { ItemList, type PaidFilter, type SortKey } from "./ItemList";
import { Providers } from "./providers";
import { useGuests } from "./queries";
import { Toasts } from "./Toasts";
import { useDebouncedValue } from "./useDebouncedValue";
import { useAppStore } from "./zustand-store";
// ## 1.14
// One broken section shouldn't take down the page (`GET /api/guests/:id?d=fail`). A guest's receipt view is heavy, so only load it when someone opens it. Loading, error and empty handling is copy-pasted around the app, so centralize it. Add tests for the guest name display and for marking an item as paid.

function Bills() {
   const [search, setSearch] = useState("");
   const [paidFilter, setPaidFilter] = useState<PaidFilter>("all");
   const [sort, setSort] = useState<SortKey>("default");
   const [receiptGuestId, setReceiptGuestId] = useState("");
   const [receiptOpen, setReceiptOpen] = useState(false);
   const searchRef = useRef<HTMLInputElement>(null);
   const debouncedSearch = useDebouncedValue(search, 250);
   const guests = useGuests();
   const theme = useAppStore((s) => s.theme);
   const filterOpen = useAppStore((s) => s.filterOpen);
   const setTheme = useAppStore((s) => s.setTheme);
   const toggleFilter = useAppStore((s) => s.toggleFilter);
   const hydrate = useAppStore((s) => s.hydrate);

   useEffect(() => {
      hydrate();
      searchRef.current?.focus();
   }, [hydrate]);

   return (
      <div
         className={`min-h-screen ${theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-white text-neutral-900"}`}
      >
         <main className="mx-auto w-full max-w-md px-4 py-10">
            <h1 className="mb-6">Restaurant bills</h1>
            <div className="flex flex-col gap-3">
               <div className="flex gap-2">
                  <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                     {theme === "dark" ? "Light theme" : "Dark theme"}
                  </button>
                  <button type="button" aria-expanded={filterOpen} onClick={toggleFilter}>
                     {filterOpen ? "Hide filters" : "Show filters"}
                  </button>
               </div>
               {filterOpen && (
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
               <div className="flex flex-col gap-2 rounded-lg border border-current/20 p-4">
                  <label htmlFor="receipt-guest" className="flex flex-col gap-1 text-sm">
                     Guest receipt
                     <select
                        id="receipt-guest"
                        value={receiptGuestId}
                        onChange={(e) => {
                           setReceiptGuestId(e.target.value);
                           setReceiptOpen(false);
                        }}
                     >
                        <option value="">Pick a guest</option>
                        {guests.data?.map((guest) => (
                           <option key={guest.id} value={guest.id}>
                              {guest.name}
                           </option>
                        ))}
                     </select>
                  </label>
                  <button
                     type="button"
                     disabled={receiptGuestId === ""}
                     onClick={() => setReceiptOpen((open) => !open)}
                  >
                     {receiptOpen ? "Close receipt" : "Open receipt"}
                  </button>
                  {receiptOpen && receiptGuestId !== "" && (
                     <div>
                        {/* TODO: your code goes here */}
                     </div>
                  )}
               </div>
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
         <Bills />
      </Providers>
   );
}
