"use client";

import { useState } from "react";
import { transactions, type Transaction } from "./data";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const people = Array.from(new Set(transactions.map((t) => t.person)));

function totalsByPerson(list: Transaction[]) {
   const totals = new Map<string, number>();
   for (const t of list) totals.set(t.person, (totals.get(t.person) ?? 0) + t.amountCents);
   return [...totals.entries()].map(([person, cents]) => ({ person, cents }));
}

export default function Page() {
   const [query, setQuery] = useState("");
   const [person, setPerson] = useState("");

   // The visible list and the totals are derived from the two filter values, never stored.
   const q = query.trim().toLowerCase();
   const visible = transactions.filter(
      (t) =>
         (!person || t.person === person) &&
         (!q || t.description.toLowerCase().includes(q) || t.person.toLowerCase().includes(q)),
   );
   const totals = totalsByPerson(visible);
   const top = Math.max(0, ...totals.map((t) => t.cents));

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Transactions</h1>

         <div className="mb-4 flex gap-3">
            <label className="flex flex-col text-sm">
               Search
               <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded border px-2 py-1"
               />
            </label>
            <label className="flex flex-col text-sm">
               Person
               <select value={person} onChange={(e) => setPerson(e.target.value)} className="rounded border px-2 py-1">
                  <option value="">All people</option>
                  {people.map((p) => (
                     <option key={p} value={p}>
                        {p}
                     </option>
                  ))}
               </select>
            </label>
         </div>

         <section aria-label="Totals" className="mb-6">
            <ul className="flex flex-col gap-1">
               {totals.map(({ person: name, cents }) => (
                  <li
                     key={name}
                     aria-current={cents === top ? "true" : undefined}
                     className={`flex justify-between rounded px-2 py-1 ${cents === top ? "bg-yellow-200 font-semibold" : ""}`}
                  >
                     <span>{name}</span>
                     <span>{usd.format(cents / 100)}</span>
                  </li>
               ))}
            </ul>
         </section>

         {visible.length === 0 ? (
            <p>No transactions match your search.</p>
         ) : (
            <ul aria-label="Transactions" className="flex flex-col gap-2">
               {visible.map((t) => (
                  <li key={t.id} className="flex justify-between rounded-lg border border-current/20 p-3">
                     <div>
                        <p className="font-semibold">{t.description}</p>
                        <p className="text-sm opacity-70">
                           {t.person} · {t.date}
                        </p>
                     </div>
                     <p>{usd.format(t.amountCents / 100)}</p>
                  </li>
               ))}
            </ul>
         )}
      </main>
   );
}
