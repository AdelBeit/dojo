# Code input

Time box: 45 minutes. Stage 1 should take 10 to 15 minutes.

## Prompt

Build a verification code entry component
- a row of single-digit boxes
- Digits only. No letters.

## Stage 1: boxes and auto-advance

- `<CodeInput />` renders 4 single digit text inputs by default.
- Typing a digit puts it in the focused box and moves focus to the next box.
- Anything that is not a digit 0 to 9 is ignored: the box stays empty and focus stays put.
- Typing in the last box keeps focus there.
- Each box accepts at most one character.

### Follow-up questions

- Why one input per digit and not a single input styled as boxes? What does each design cost?
- Where do you keep the refs to the boxes? Why refs and not state?
- Is the focus change a side effect of the event or of the render? Where should it go?

## Stage 2: Backspace and arrow keys

- Backspace in a box that has a digit clears that box and keeps focus there.
- Backspace in an empty box moves focus to the previous box and clears it.
- Backspace in the first box when it is empty does nothing.
- ArrowLeft and ArrowRight move focus to the previous and next box. At either end nothing happens.
- Typing a digit into a box that already has one replaces it and moves on.

### Follow-up questions

- Which event do you use for Backspace, and why not `onChange`?
- What happens with the cursor position inside a box that already holds a digit?

## Stage 3: paste, length and onComplete

- `length` prop: `<CodeInput length={6} />` renders 6 boxes. The default stays 4. Everything from stages 1 and 2 works for any length.
- `onComplete` prop: called with the full code as a string, once, when every box has a digit.
- Pasting into any box replaces the whole code with the pasted digits, starting at the first box. Boxes after the pasted digits are cleared. Non-digit characters in the pasted text are dropped. Extra digits beyond `length` are ignored. Focus ends on the box after the last filled one, or the last box if all are filled.
- If a complete code is edited afterwards (a digit is cleared) and completed again, `onComplete` fires again.
- Make the 6-digit version the one on `page.tsx` too, next to the 4-digit one, to prove the component is generic.

### Follow-up questions

- Where does your paste handler live? Which event, and what does it read?
- How do you avoid calling `onComplete` on every render once the code is full?
- How would you add an `error` state that shakes the boxes and clears them?

## Bonus: HTML and accessibility

- Add accessible names to the boxes: "Digit 1", "Digit 2", ... up to the last box, for any `length`.
- Give the inputs `inputMode="numeric"` and `autoComplete="one-time-code"` so phones offer the code from a text message.
