import type { Guest, Item, NewItem } from "./types";

// In-memory mock database. Lives on globalThis so dev hot reloads keep the data.

type StoredGuest = Pick<Guest, "id" | "name">;
type Db = { guests: StoredGuest[]; items: Item[]; nextId: number };

const GUEST_NAMES = [
  "Avery", "Blake", "Casey", "Devon", "Emery", "Finley",
  "Gray", "Harper", "Indy", "Jules", "Kai", "Logan",
];

const MENU: { name: string; priceCents: number }[] = [
  { name: "Pad thai", priceCents: 1400 },
  { name: "Green curry", priceCents: 1500 },
  { name: "Spring rolls", priceCents: 700 },
  { name: "Thai iced tea", priceCents: 500 },
  { name: "Mango sticky rice", priceCents: 800 },
  { name: "Pho", priceCents: 1300 },
  { name: "Banh mi", priceCents: 1000 },
  { name: "Boba tea", priceCents: 600 },
  { name: "Dumplings", priceCents: 900 },
  { name: "Fried rice", priceCents: 1200 },
  { name: "Miso soup", priceCents: 400 },
  { name: "Edamame", priceCents: 600 },
  { name: "Ramen", priceCents: 1400 },
  { name: "Sushi roll", priceCents: 1300 },
  { name: "Gyoza", priceCents: 800 },
];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function itemId(n: number) {
  return `item-${String(n).padStart(4, "0")}`;
}

function seed(): Db {
  const rand = rng(7);
  const pick = (n: number) => Math.floor(rand() * n);
  const guests = GUEST_NAMES.map((name, i) => ({ id: `g${String(i + 1).padStart(2, "0")}`, name }));
  const items: Item[] = [];
  for (let n = 1; n <= 400; n++) {
    const dish = MENU[pick(MENU.length)];
    items.push({
      id: itemId(n),
      guestId: guests[pick(guests.length)].id,
      name: dish.name,
      priceCents: dish.priceCents,
      paid: rand() < 0.35,
    });
  }
  return { guests, items, nextId: 401 };
}

const g = globalThis as unknown as { __restaurantDb?: Db };

function db(): Db {
  return (g.__restaurantDb ??= seed());
}

function withTotals(guest: StoredGuest): Guest {
  const own = db().items.filter((i) => i.guestId === guest.id);
  return {
    ...guest,
    itemCount: own.length,
    owesCents: own.filter((i) => !i.paid).reduce((sum, i) => sum + i.priceCents, 0),
  };
}

export function listItems(limit?: number): Item[] {
  const all = db().items;
  return limit ? all.slice(0, limit) : all;
}

export function listGuests(): Guest[] {
  return db().guests.map(withTotals);
}

export function getGuest(id: string): Guest | undefined {
  const guest = db().guests.find((x) => x.id === id);
  return guest && withTotals(guest);
}

export function setPaid(id: string, paid: boolean): Item | undefined {
  const item = db().items.find((i) => i.id === id);
  if (item) item.paid = paid;
  return item;
}

export function createItem(input: NewItem): Item | string {
  const d = db();
  if (!d.guests.some((x) => x.id === input.guestId)) return "Unknown guest";
  if (!input.name?.trim()) return "Name is required";
  if (!Number.isInteger(input.priceCents) || input.priceCents <= 0) return "Price must be positive";
  const item: Item = {
    id: itemId(d.nextId++),
    guestId: input.guestId,
    name: input.name.trim(),
    priceCents: input.priceCents,
    paid: false,
  };
  d.items.unshift(item);
  return item;
}

// Simulates someone paying at the counter or from another phone.
export function payRandom(): Item | undefined {
  const open = db().items.filter((i) => !i.paid);
  if (open.length === 0) return undefined;
  const item = open[Math.floor(Math.random() * open.length)];
  item.paid = true;
  return item;
}

export function resetDb() {
  g.__restaurantDb = seed();
}
