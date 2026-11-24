import { memo } from "react";
import type { Item } from "@/lib/restaurant-bill/types";
import { useAppState } from "./context-state";
import { useMarkPaid } from "./mutations";
import { useGuest } from "./queries";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const ItemCard = memo(function ItemCard({ item }: { item: Item }) {
   const guest = useGuest(item.guestId);
   const markPaid = useMarkPaid();
   const { state, dispatch } = useAppState();
   const starred = state.stars[item.id] === true;
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
               onClick={() => dispatch({ type: "toggleStar", id: item.id })}
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
         {markPaid.isError && (
            <p role="alert" className="text-sm text-red-600">
               Could not mark as paid, it was put back.
            </p>
         )}
      </div>
   );
});
