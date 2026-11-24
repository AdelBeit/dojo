import { memo, useMemo } from "react";
import { ItemCard } from "./ItemCard";
import { useItems } from "./queries";

export type PaidFilter = "all" | "paid" | "unpaid";
export type SortKey = "default" | "price-asc" | "price-desc" | "name";

type Props = {
   search: string;
   paidFilter: PaidFilter;
   sort: SortKey;
};

export const ItemList = memo(function ItemList({ search, paidFilter, sort }: Props) {
   const { data: items, status, error } = useItems();

   const visible = useMemo(() => {
      if (!items) return [];
      const query = search.trim().toLowerCase();
      const filtered = items.filter(
         (item) =>
            (query === "" || item.name.toLowerCase().includes(query)) &&
            (paidFilter === "all" || item.paid === (paidFilter === "paid")),
      );
      if (sort === "default") return filtered;
      return filtered.sort((a, b) => {
         if (sort === "price-asc") return a.priceCents - b.priceCents || a.id.localeCompare(b.id);
         if (sort === "price-desc") return b.priceCents - a.priceCents || a.id.localeCompare(b.id);
         return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
      });
   }, [items, search, paidFilter, sort]);

   if (status === "pending") return <p>Loading...</p>;
   if (status === "error") return <p role="alert">There was an error fetching items: {error.message}</p>;
   if (visible.length === 0) return <p>No items match.</p>;
   return (
      <>
         {visible.map((item) => (
            <ItemCard key={item.id} item={item} />
         ))}
      </>
   );
});
