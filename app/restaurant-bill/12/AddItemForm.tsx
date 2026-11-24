import { useState, type FormEvent } from "react";
import { useAddItem } from "./mutations";
import { useGuests } from "./queries";

export function AddItemForm() {
   const guests = useGuests();
   const addItem = useAddItem();
   const [guestId, setGuestId] = useState("");
   const [name, setName] = useState("");
   const [price, setPrice] = useState("");

   const priceCents = Math.round(Number(price) * 100);
   const valid = guestId !== "" && name.trim() !== "" && Number.isFinite(priceCents) && priceCents > 0;

   function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (!valid) return;
      addItem.mutate({ guestId, name: name.trim(), priceCents });
      setName("");
      setPrice("");
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-current/20 p-4">
         <h2>Add an item</h2>
         <label htmlFor="add-guest" className="flex flex-col gap-1 text-sm">
            Guest
            <select id="add-guest" value={guestId} onChange={(e) => setGuestId(e.target.value)} required>
               <option value="">
                  {guests.status === "pending" && "Loading guests..."}
                  {guests.status === "error" && "Could not load guests"}
                  {guests.status === "success" && "Pick a guest"}
               </option>
               {guests.data?.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                     {guest.name}
                  </option>
               ))}
            </select>
         </label>
         <label htmlFor="add-name" className="flex flex-col gap-1 text-sm">
            Name
            <input id="add-name" value={name} onChange={(e) => setName(e.target.value)} required />
         </label>
         <label htmlFor="add-price" className="flex flex-col gap-1 text-sm">
            Price (USD)
            <input
               id="add-price"
               type="number"
               min="0.01"
               step="0.01"
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               required
            />
         </label>
         <button type="submit" disabled={!valid}>
            Add item
         </button>
         {addItem.isError && (
            <p role="alert" className="text-sm text-red-600">
               Could not add &quot;{addItem.variables.name}&quot;: {addItem.error.message}. It was removed from the list.
            </p>
         )}
      </form>
   );
}
