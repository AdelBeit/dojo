export type Transaction = {
  id: string;
  person: string;
  description: string;
  amountCents: number;
  date: string;
};

export const transactions: Transaction[] = [
  { id: "t1", person: "Ana Silva", description: "Coffee beans", amountCents: 1850, date: "2026-03-01" },
  { id: "t2", person: "Ben Okafor", description: "Team lunch", amountCents: 6420, date: "2026-03-01" },
  { id: "t3", person: "Cleo Martin", description: "Taxi to airport", amountCents: 4500, date: "2026-03-02" },
  { id: "t4", person: "Ana Silva", description: "Notebook", amountCents: 1299, date: "2026-03-02" },
  { id: "t5", person: "Ben Okafor", description: "Monitor stand", amountCents: 8900, date: "2026-03-03" },
  { id: "t6", person: "Cleo Martin", description: "Coffee refill", amountCents: 650, date: "2026-03-03" },
  { id: "t7", person: "Ana Silva", description: "Train ticket", amountCents: 3200, date: "2026-03-04" },
  { id: "t8", person: "Ben Okafor", description: "Coffee machine", amountCents: 12500, date: "2026-03-04" },
  { id: "t9", person: "Cleo Martin", description: "Software license", amountCents: 9900, date: "2026-03-05" },
  { id: "t10", person: "Ana Silva", description: "Lunch", amountCents: 1475, date: "2026-03-05" },
  { id: "t11", person: "Ben Okafor", description: "Parking", amountCents: 1200, date: "2026-03-06" },
  { id: "t12", person: "Cleo Martin", description: "Lunch", amountCents: 1320, date: "2026-03-06" },
];
