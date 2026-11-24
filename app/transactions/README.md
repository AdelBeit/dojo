# Transactions

Time box: 45 minutes. Stage 1 should take 10 to 15 minutes.

Show the transactions from `data.ts` on a page. Do not edit `data.ts`.

- Amounts are integer cents. Format with `Intl.NumberFormat`.
- The data is a static array. No fetching.

## Stage 1: display the list

Show every transaction in a list, in the order they appear in `data.ts`. Each row shows the description, the person, the date and the amount as US dollars (for example `$18.50`).

### Follow-up questions

- Why integer cents instead of dollars as floats?
- Is `key={index}` fine here? What would break if the list could be reordered?
- Where does the list come from if this becomes an API? What changes in the component?

## Stage 2: totals per person

Add a "Totals" section: a list with one item per person, showing the name and their total as US dollars.

Highlight the person with the highest total. The visual style is up to you.

Keep the transactions list from stage 1 working.

### Follow-up questions

- Did you store the totals in state or compute them from the list? Why?
- What is the complexity of computing totals? Would you memoize it? When would that matter?
- What happens if two people tie for the highest total?

## Stage 3: search and filter

Add two controls above the list:

- A text search field labeled "Search". It filters transactions whose description or person contains the text, ignoring case.
- A select labeled "Person" with the options "All people" plus one option per person. Choosing a person shows only that person's transactions. The option text is the person's name.

Both filters apply together. When nothing matches, show the text "No transactions match" instead of the list.

### A question you should ask the interviewer

Should the totals section follow the filters, or always show totals for everything?

Decide for yourself first, then open the answer below.

<details>
<summary>The interviewer's answer (open after you asked)</summary>

The totals follow the filters: they cover only the transactions currently shown, and the highest total among those is the highlighted one.

</details>

### Follow-up questions

- Is the filtered list state or derived? Where does it live?
- How would the search behave with 100,000 rows? What would you change (debounce, memo, virtualization)?
- The search field is a controlled input. What breaks if it is not?

## Bonus: accessibility

- The transactions list is a `<ul>` (or `role="list"`) with the accessible name "Transactions", and each row is a list item.
- The Totals section is a `<section aria-label="Totals">`. Its list is not counted as part of the Transactions list.
