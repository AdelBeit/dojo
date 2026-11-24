export type Item = {
  id: string;
  guestId: string;
  name: string;
  priceCents: number;
  paid: boolean;
};

export type Guest = {
  id: string;
  name: string;
  // Sum of this guest's items that are not paid yet. Changes when an item is paid.
  owesCents: number;
  itemCount: number;
};

export type NewItem = {
  guestId: string;
  name: string;
  priceCents: number;
};
