import type { Item } from "@/lib/restaurant-bill/types";

export function ItemCard({ item }: { item: Item }) {
   // TODO: your code goes here
   const formattedPrice = item.priceCents;
   return (
      <div className="flex flex-col gap-1 rounded-lg border border-current/20 p-4">
         <h1 className="font-semibold">name</h1>
         <div className="flex justify-between text-sm">
            <h2 className="opacity-70">price</h2>
            <h2>paid status</h2>
         </div>
      </div>
   )
}
