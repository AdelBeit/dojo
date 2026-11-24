import type { Item } from "@/lib/restaurant-bill/types";

export const items: Item[] = [
  { id: "item-0001", guestId: "g01", name: "Pad thai", priceCents: 1499, paid: false },
  { id: "item-0002", guestId: "g07", name: "Miso soup", priceCents: 430, paid: true },
  { id: "item-0003", guestId: "g03", name: "Spring rolls", priceCents: 712, paid: false },
  { id: "item-0004", guestId: "g01", name: "Thai iced tea", priceCents: 500, paid: false },
  { id: "item-0005", guestId: "g05", name: "Ramen", priceCents: 1400, paid: true },
  { id: "item-0006", guestId: "g02", name: "Mango sticky rice", priceCents: 800, paid: false },
  { id: "item-0007", guestId: "g03", name: "Dumplings", priceCents: 900, paid: false },
  { id: "item-0008", guestId: "g07", name: "Boba tea", priceCents: 600, paid: true },
];
