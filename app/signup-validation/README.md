# Signup validation

Time box: 45 to 60 minutes. Stage 1 should take 10 to 15 minutes.

Build a signup form with four fields: "Username", "Email", "Password" and "Confirm password", and a "Create account" button.

- Fields are text inputs.
- `lib/fake-api.ts` is the fake backend.

## Stage 1: required fields

- Submitting the form with an empty field shows a message under that field. Use exactly these messages: `Username is required`, `Email is required`, `Password is required`, `Confirm your password`.
- A form with all four fields filled submits: call `fakeApi.post("/signup", values)` and, when it resolves, replace the form with the text "Account created".
- With any required field empty, the form does not call the API.
- Add `noValidate` to the form, or the browser shows its own bubbles instead of your messages.

### Follow-up questions

- Where do the error messages come from: state, or computed from the values?
- When should an error appear: on submit, on blur, or on every keystroke? What are the tradeoffs?
- How would you test the validation rules without rendering the form?

## Stage 2: format rules with live feedback

Add format rules. Use exactly these messages:

| Field | Rule | Message |
|---|---|---|
| Username | 3 to 16 characters: letters, numbers or underscores | `Username must be 3 to 16 letters, numbers or underscores` |
| Email | looks like `something@something.tld` | `Enter a valid email` |
| Password | at least 8 characters and at least one number | `Password must be at least 8 characters and include a number` |

Behavior ("live feedback"):

- A field's message appears once the user has left the field (blur). An empty field shows its required message at that point.
- After that, the message updates on every keystroke: it disappears the moment the value becomes valid, and comes back if it becomes invalid again.
- Submitting still shows messages for every invalid field, touched or not.
- The stage 1 behavior still works.

### Follow-up questions

- How do you track "touched" per field? Is it state?
- Why not show errors before the user has had a chance to type?
- Where would the validation rules live if three other forms needed the same email rule?

## Stage 3: cross-field and async rules

- **Confirm password** must equal Password. Message: `Passwords do not match`. It is re-checked whenever Password changes, not only when Confirm changes. Once the user has left Confirm, editing Password so that they match makes the message disappear.
- **Username availability** is checked against the server with `fakeApi.post("/check-username", { username })`, which resolves to `{ available: boolean }`. The names "admin", "root" and "taken" are not available.
  - The check runs when the user leaves the Username field, and only if the username already passes the format rule.
  - While it runs, show the text `Checking username...`.
  - If the name is not available, show `Username is taken` under the field.
  - Submit is blocked while the username is known to be taken. If the user submits before the check ever ran, run it first, then continue only if the name is available.
  - Do not send a request for a value you already checked.

### Follow-up questions

- A slow response for "ana" arrives after the user typed "anabel". How do you avoid showing the old result?
- Should the form submit while a check is in flight? What did you choose and why?
- How would you debounce the check if it ran on every keystroke?

## Bonus: accessibility (the interviewer adds this late)

The form must work well for screen reader and keyboard users.

- Every input is tied to a real `<label>`, so it has an accessible name.
- An input whose message is showing has `aria-invalid="true"`. Inputs with no message showing do not.
- The message is connected to its input with `aria-describedby`, so the input's accessible description is the message text.
- When the user submits with errors, focus moves to the first invalid field in form order.
- The whole form works with the keyboard: pressing Enter in any field submits it, and Tab visits the fields in order and then the button.
- Do not rely on color alone to show an error.

### Follow-up questions

- When is `role="alert"` or `aria-live` better than `aria-describedby`? Would you add it here?
- What does a screen reader announce when focus lands on an invalid field in your form?
- Why must the message element exist in the DOM for `aria-describedby` to work?
