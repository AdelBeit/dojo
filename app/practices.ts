export type Practice = {
  slug: string;
  title: string;
  description: string;
};

// Add a practice here, then create app/<slug>/page.tsx for it.
export const practices: Practice[] = [
  {
    slug: "transactions",
    title: "Drill 1: Transactions",
    description: "List, per-person totals, search and filter.",
  },
  {
    slug: "multi-step-form",
    title: "Drill 2: Multi-step form",
    description: "Steps, validation, submit with loading and error states.",
  },
  {
    slug: "code-input",
    title: "Drill 3: Code input",
    description: "Digit boxes with refs, focus, keyboard and paste.",
  },
  {
    slug: "signup-validation",
    title: "Drill 4: Signup validation",
    description: "Format, cross-field and async rules, then accessibility.",
  },
  {
    slug: "contact-form",
    title: "Drill 5: Contact form",
    description: "Validation, sending, and preventing double submits.",
  },
  {
    slug: "tooltip",
    title: "Drill 6: Tooltip",
    description: "Written design, then a reusable component.",
  },
  {
    slug: "match-the-demo",
    title: "Drill 7: Match the demo",
    description: "Rebuild a dropdown from a running demo at /match-the-demo/demo.html.",
  },
  {
    slug: "encode-decode",
    title: "Drill 8: Encode and decode",
    description: "Run-length encoding forms with shared state.",
  },
];
