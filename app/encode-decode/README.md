# Encode and decode forms

Time box: 45 minutes. Stage 1 should take 10 to 15 minutes. Type every snippet yourself, some screens do not let you paste.

Build React forms that encode and decode strings with the algorithm below. The point is using state properly.

## The algorithm: run-length encoding

Replace each run of the same character with the length of the run followed by the character.

| Input | Encoded |
|---|---|
| `aaabcc` | `3a1b2c` |
| `a` | `1a` |
| `abc` | `1a1b1c` |
| `aaaaaaaaaaaa` (12 a's) | `12a` |
| `aA` | `1a1A` |
| `aa  b` (two spaces) | `2a2 1b` |
| (empty) | (empty) |

Rules:

- Case matters: `a` and `A` are different characters.
- Spaces and punctuation are characters like any other.
- Input to encode must not contain digits, because digits would be ambiguous in the output. See stage 3 for what to do when it does.

## Stage 1: the encode form

- An "Encode" form with a text input labeled "Text to encode", an "Encode" button, and a read-only text input labeled "Encoded result" that shows the encoded value.
- Clicking Encode computes the result. Encoding the empty string gives an empty result.
- Encoding again replaces the previous result.

### Follow-up questions

- Is the encoded result state, or can it be derived? What changes if encoding only happens on click?
- Where does the algorithm live, and could it be tested without React?
- What is the time complexity of your encode? Of building the string?

## Stage 2: the decode form and a round-trip check

- A second, "Decode" form with a text input labeled "Text to decode", a "Decode" button, and a read-only text input labeled "Decoded result".
- Clicking Decode computes the original text: `3a1b2c` becomes `aaabcc`, `12a` becomes twelve a's, `1a1A` becomes `aA`.
- Round trip: after a successful, non-empty encode, show the text `Round trip OK` in the Encode form when decoding the encoded result gives back exactly the original input. Use your decode function for this check, do not just print the text. Show nothing when the input was empty.

### Follow-up questions

- Why check the round trip at all if the algorithm is correct? What would it catch?
- Is "Round trip OK" state, or derived from state? Where do you compute it?

## Stage 3: shared state and invalid input

**Shared state.** After a successful encode, a button "Send to decoder" appears in the Encode form. Clicking it copies the encoded result into the "Text to decode" field and clears the decode result and any decode error. The button is not there before a successful encode.

**Invalid input.** Each form has its own error, shown inside that form:

- Encoding text that contains a digit shows `Input must not contain digits`, and the encoded result is empty. The "Send to decoder" button and the round-trip text are not shown.
- Decoding a string that is not valid run-length output shows `Invalid encoded string`, and the decoded result is empty. Valid means: zero or more groups, each a count from 1 upward with no leading zero, followed by one non-digit character. So `abc`, `3`, `0a` and `a3` are invalid. The empty string is valid and decodes to an empty string.
- An error clears the next time that same form is submitted successfully.
- An error in one form never touches the other form.

### Follow-up questions

- Where does the shared state live? What would change if the two forms were on different pages?
- How did you decide the decode validity rule? Did you use a regular expression?
- What is a huge count like `999999999a` going to do? Would you cap it?

## Stage 4: a second algorithm (ask for a review)

The interviewer says: "Great. Now the other team wants the same forms with a Caesar shift of 3: each letter moves three places forward in the alphabet and wraps, so `abc` becomes `def` and `xyz` becomes `abc`. Case is kept, and other characters are left alone."

Do not copy the page. Change your code so that adding this algorithm touches as little as possible:

- Describe an algorithm as one object or a pair of functions plus its input rule.
- The forms receive the algorithm and do not know which one it is.
- Show the same page with both algorithms, for example in two sections.

When you finish, ask me to review how you separated the algorithm from the forms.

### Follow-up questions

- What is the smallest interface an algorithm needs to give the form?
- Where would you put each algorithm's validation rule (RLE rejects digits, Caesar does not)?
- How would you add a third algorithm tomorrow?

## Bonus: accessibility

- Each form has an accessible name: "Encode" and "Decode".
- Each error is shown in an element with `role="alert"` inside its form.
