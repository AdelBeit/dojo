import { ItemCard } from "./ItemCard";
import { useItems } from "./queries";

// TODO: your code goes here
export function ItemList() {
   const { data: items, status, error } = useItems();
   // TODO: your code goes here

   if (status === "pending") return <p>Loading...</p>;
   if (status === "error") return <p role="alert">There was an error fetching items: {error.message}</p>;
   return (
      <>
         {items.map((item) => (
            <ItemCard key={item.id} item={item} />
         ))}
      </>
   );
}
