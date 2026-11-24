# Contact form

Time box: 45 minutes. Stage 1 should take 10 to 15 minutes.

Build a contact form that sends a user's feedback to a back end API.

- The back end is the fake API in `lib/fake-api.ts` (used from stage 3).
- Add `noValidate` to the form, so your own messages show instead of the browser's.

## Stage 1: the form

- Three fields: "Name" (an input), "Email" (an input) and "Message" (a textarea), plus a "Send" button.
- All three are controlled: typing shows what was typed.
- Under the Message field, show a character counter like `12/500`. The message cannot be longer than 500 characters.
- Submitting the form must not reload the page. Nothing is sent yet.

### Follow-up questions

- Controlled vs uncontrolled inputs: why controlled here?
- Where does the counter's number come from: state or derived from the message?
- What would change if this had 15 fields?

## Stage 2: validation

Validate when the user clicks Send. Use exactly these messages:

| Field | Rule | Message |
|---|---|---|
| Name | not empty (ignore whitespace) | `Name is required` |
| Email | looks like `something@something.tld` | `Enter a valid email` |
| Message | at least 10 characters (ignore leading and trailing whitespace) | `Message must be at least 10 characters` |

- Show each message under its field. Show all of them at once.
- An invalid form is not sent anywhere.
- When the user edits a field that has a message, that message goes away.
- Fixing everything and clicking Send again leaves no messages on screen. (Actually sending comes in stage 3.)

### Follow-up questions

- Would you also validate on the server? Why?

## Stage 3: sending

A valid form calls `fakeApi.post("/contact", values)` where `values` holds the name, email and message.

- While the request is pending, the Send button is disabled and reads "Sending...".
- On success, show "Thanks, we got your message" and clear all three fields so another message can be sent.
- On failure, show the error message from the thrown error. Keep everything the user typed and enable Send again for a retry.
- Prevent double submission: clicking Send twice quickly, or pressing Enter twice in a field, sends exactly one request.

To try the loading and error states by hand, put this at the top of your page for a while, and remove it when done:

```ts
import { fakeApi } from "@/lib/fake-api";
fakeApi.configure({ delayMs: 1500, failNext: 1 });
```

### Follow-up questions

- Is a disabled button enough to prevent a double submit? What else guards it?
- What if the user navigates away while the request is pending?
- How would you add a retry with backoff, and where would that logic live?

## Bonus: accessibility

- Every input is tied to a real `<label>`.
- The success message is in an element with `role="status"`, and the failure message is in one with `role="alert"`.

### Follow-up questions

- How would you show the validation errors to a screen reader user?
