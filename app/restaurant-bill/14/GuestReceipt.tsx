import { useGuest, useItems } from "./queries";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function GuestReceipt({ guestId }: { guestId: string }) {
   const guest = useGuest(guestId);
   const items = useItems();

   if (guest.status === "pending" || items.status === "pending") return <p>Loading receipt...</p>;
   if (guest.status === "error") return <p role="alert">Could not load the receipt: {guest.error.message}</p>;
   if (items.status === "error") return <p role="alert">Could not load the receipt: {items.error.message}</p>;

   const own = items.data.filter((item) => item.guestId === guestId);
   if (own.length === 0) return <p>No items for {guest.data.name} yet.</p>;
   return (
      <section aria-label={`Receipt for ${guest.data.name}`} className="flex flex-col gap-2">
         <h2>{guest.data.name}</h2>
         <ul className="flex flex-col gap-1 text-sm">
            {own.map((item) => (
               <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className={item.paid ? "text-green-700" : "text-red-600"}>
                     {usd.format(item.priceCents / 100)} {item.paid ? "Paid" : "Unpaid"}
                  </span>
               </li>
            ))}
         </ul>
         <p className="font-semibold">Owes {usd.format(guest.data.owesCents / 100)}</p>
      </section>
   );
}
