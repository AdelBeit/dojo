import { useState } from "react";
import type { Item } from "@/lib/restaurant-bill/types";
import { useGuest } from "./useGuest";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function ItemCard({ item, onMarkPaid }: { item: Item; onMarkPaid: (id: string) => Promise<void> }) {
   // TODO: your code goes here
   const { guest, error } = useGuest(item.guestId);
   const [pending, setPending] = useState(false);
   const [failed, setFailed] = useState(false);

   async function handleMarkPaid() {
      setPending(true);
      setFailed(false);
      try {
         await onMarkPaid(item.id);
      } catch {
         setFailed(true);
      } finally {
         setPending(false);
      }
   }

   return (
      <div className="flex flex-col gap-1 rounded-lg border border-current/20 p-4">
         <h3 className="font-semibold">{item.name}</h3>
         <p className="text-sm opacity-70">
            {error ? "Guest unavailable" : guest?.name ?? "..."}
            {guest && ` (owes ${usd.format(guest.owesCents / 100)})`}
         </p>
         <div className="flex justify-between text-sm">
            <p className="opacity-70">{usd.format(item.priceCents / 100)}</p>
            <p className={item.paid ? "text-green-700" : "text-red-600"}>{item.paid ? "Paid" : "Unpaid"}</p>
         </div>
         {!item.paid && (
            <button type="button" disabled={pending} onClick={handleMarkPaid}>
               {pending ? "Paying..." : "Mark paid"}
            </button>
         )}
         {failed && <p role="alert" className="text-sm text-red-600">Could not mark as paid</p>}
      </div>
   )
}
