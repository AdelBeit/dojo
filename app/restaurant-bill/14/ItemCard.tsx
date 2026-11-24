import { memo } from "react";
import type { Item } from "@/lib/restaurant-bill/types";
import { useMarkPaid } from "./mutations";
import { useGuest } from "./queries";
import { useAppStore } from "./zustand-store";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const ItemCard = memo(function ItemCard({ item }: { item: Item }) {
   const guest = useGuest(item.guestId);
   const markPaid = useMarkPaid();
   const starred = useAppStore((s) => s.stars[item.id] === true);
   const toggleStar = useAppStore((s) => s.toggleStar);
   const guestLabel = guest.status === "error" ? "Guest unavailable" : guest.data?.name ?? "...";
   const isTemp = item.id.startsWith("temp-");
   return (
      <div className="flex flex-col gap-1 rounded-lg border border-current/20 p-4">
         <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{item.name}</h3>
            <button
               type="button"
               aria-pressed={starred}
               aria-label={starred ? `Unstar ${item.name}` : `Star ${item.name}`}
               onClick={() => toggleStar(item.id)}
            >
               {starred ? "★" : "☆"}
            </button>
         </div>
         <p className="text-sm opacity-70">
            {guestLabel}
            {guest.data && ` (owes ${usd.format(guest.data.owesCents / 100)})`}
         </p>
         <div className="flex justify-between text-sm">
            <p className="opacity-70">{usd.format(item.priceCents / 100)}</p>
            <p className={item.paid ? "text-green-700" : "text-red-600"}>{item.paid ? "Paid" : "Unpaid"}</p>
         </div>
         {!item.paid && !isTemp && (
            <button type="button" disabled={markPaid.isPending} onClick={() => markPaid.mutate(item.id)}>
               {markPaid.isPending ? "Paying..." : "Mark paid"}
            </button>
         )}
      </div>
   );
});
