# Multi-step form

Time box: 45 minutes. Stage 1 should take 10 to 15 minutes.

- Postal codes are US style, exactly 5 digits.
- There is a fake async backend in `lib/fake-api.ts` (used from stage 3). Call `fakeApi.post("/signup", values)`. It returns a promise.

## Stage 1: steps and navigation

- Step 1: "Basic info": fields labeled "Full name" and "Email".
- Step 2: "Address": fields labeled "Street", "City" and "Postal code".
- Step 3: "Confirm": shows a summary of everything entered, and a "Submit" button. It has no Next button.
- Show the current position as text: "Step 1 of 3", "Step 2 of 3", "Step 3 of 3".
- Steps 1 and 2 have a "Next" button. Steps 2 and 3 have a "Back" button. Step 1 has no Back button.
- Values you entered stay in the fields when you go back and forth.
- Nothing is validated yet. Next always works.

### Follow-up questions

- Why did you pick `useReducer` or `useState` for this? What would push you the other way?
- How would you structure this if there were 10 steps?
- Where does each step's state live: in the step component or in the parent? Why?
- Would `React.memo` or lazy rendering of steps help here? When would it matter?

## Stage 2: validation and disabled states

Validate each step. Use exactly these messages:

| Field | Rule | Message |
|---|---|---|
| Full name | not empty (ignore whitespace) | `Name is required` |
| Email | looks like `something@something.tld` | `Enter a valid email` |
| Street | not empty | `Street is required` |
| City | not empty | `City is required` |
| Postal code | exactly 5 digits | `Postal code must be 5 digits` |

Behavior:

- A field's message appears after the user leaves the field (blur) with an invalid value, and disappears as soon as the value becomes valid.
- The Next button is disabled until every field on the current step is valid.
- The Back button is never disabled by validation.
- Keep entered values when navigating, as in stage 1.

### Follow-up questions

- Where does the validation logic live? Could you test it without rendering?
- Why show the message on blur and not on every keystroke? What are the tradeoffs?
- How would you design the error messages so they are clear without being annoying?

## Stage 3: submit against a fake API

On step 3, the Submit button calls `fakeApi.post("/signup", values)` where `values` holds all five fields.

- While the request is pending: the button is disabled and its text is "Submitting...". Back is also disabled.
- On success: replace the form with the text "Submission received".
- On failure: show the error message from the thrown error. Stay on step 3, keep every entered value, and re-enable Submit so the user can retry.
- A retry that succeeds shows "Submission received".

To try the loading and error states by hand, put this at the top of your page for a while, and remove it when done:

```ts
import { fakeApi } from "@/lib/fake-api";
fakeApi.configure({ delayMs: 1500, failNext: 1 });
```

### Follow-up questions

- How do you prevent the user from submitting twice?
- If the user navigates away while the request is pending, what happens to the response?
- What state does your submit flow have (idle, submitting, success, error)? Is it one value or several booleans?

## Bonus: accessibility

- The failure message is in an element with `role="alert"`.
