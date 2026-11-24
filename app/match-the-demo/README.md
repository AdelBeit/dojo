# Match the demo

Time box: 45 minutes. There is no written spec. You get a working demo and your job is to match it. Finding the details is part of the exercise, like asking questions in the interview.

Build a dropdown component that behaves exactly like the demo. Start the dev server (`yarn dev`) and open the demo at:

```
/match-the-demo/demo.html
```

It is a compiled page with no source. Use it like a user: mouse, keyboard, clicking elsewhere. Write down what it does, then build it in `page.tsx` (render the component from the default export).

## What is fixed

- A button that shows the text "Choose a fruit" until something is selected, and then shows the selected option's label.
- The options, in order: Apple, Banana, Cherry, Date, Elderberry. Date is disabled.
- The list is not in the DOM while closed.

Everything else you have to discover from the demo.

## Stage 1: mouse

Match the demo's behavior with the mouse only: opening, closing, choosing, the disabled option.

### Follow-up questions

- What is the difference between the highlighted option and the selected option?

## Stage 2: keyboard

Now match the demo's keyboard behavior. Try everything: from the closed button, and from the open list. Think about arrows, Home, End, Enter, Escape, which option is highlighted when the list opens, and what happens at the ends of the list and around the disabled option.

### Follow-up questions

- Does your arrow navigation wrap around? Does the demo?
- How do you scroll the highlighted option into view in a long list?

## Stage 3: the small details

Last pass. Find the behaviors you have not matched yet. Hint: look at what happens when you click somewhere else on the page, when you hover options, and when you type letters while the list is open.

### Follow-up questions

- Why attach the outside-click listener to the document, and only while open?
- How would type-ahead work with a multi-letter buffer ("che" for Cherry)?

## Bonus: accessibility

- The open list is `role="listbox"` with the accessible name "Fruit". Its items are `role="option"`.
- `aria-haspopup="listbox"` and `aria-expanded` on the button, `aria-selected` on options, `aria-disabled` on the disabled option, and `aria-activedescendant` on the listbox pointing at the highlighted option.
- Focus matches the demo: where it goes when the list opens, and where it ends up when it closes.

### Follow-up questions

- Why does focus move to the listbox when it opens, and where does it go when it closes?
- How would a screen reader user know which option is highlighted?
