import type { Item } from "@/lib/restaurant-bill/types";
import { useGuest } from "./useGuest";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function ItemCard({ item }: { item: Item }) {
   const { guest, error } = useGuest(item.guestId);
   const guestLabel = error ? "Guest unavailable" : guest?.name ?? "...";
   return (
      <div className="flex flex-col gap-1 rounded-lg border border-current/20 p-4">
         <h3 className="font-semibold">{item.name}</h3>
         <p className="text-sm opacity-70">{guestLabel}</p>
         <div className="flex justify-between text-sm">
            <p className="opacity-70">{usd.format(item.priceCents / 100)}</p>
            <p className={item.paid ? "text-green-700" : "text-red-600"}>{item.paid ? "Paid" : "Unpaid"}</p>
         </div>
      </div>
   )
}
